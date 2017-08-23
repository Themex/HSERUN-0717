<?php
/**
 * Created by Bølge Creations.
 * @name HSE RUN ONLINE QUEST (with Google Maps API and VK API)
 * @author Artyom Kamensky
 * Date: 02.07.2017
 * Time: 21:15
 * @version 1.1.6
 */
//system consts
define('INCLUDE_SECURE',true);
require_once('SessionManager.php');
const actual_link = "https://hserun.ru/online-quest/bolge.php";
const main_link = "https://hserun.ru/online-quest/quest";


const API_ok = 115;
const API_not_auth = 114;
const API_empty_request = 113;
const API_restricted =112;
const API_banned = 111;
const API_bad = 100;

const good_ans = 400;
const bad_ans = 401;

const last_time_activity = 604800;

//misc
if(!defined('INCLUDE_CHECK')) die("Access denied.");
ini_set('default_charset','utf-8');
require_once('VK/VK.php');
require_once('VK/VKException.php');

SessionManager::sessionStart('Quest',last_time_activity,'/online-quest/','hserun.ru', true, last_time_activity*2);

interface dB{
    public function dbQuery($query, $type);
    public function dbBindedQuery($query, $type, $params, $store_res);
}

interface dbAdapter {
    public function setConnect();
    public function getConnect();
}

class dataBase implements dbAdapter {
    private $db;
    private $db_host;
    private $db_user;
    private $db_pass;
    private $db_base;

    public function __construct($db_host, $db_user, $db_pass, $db_base){
        $this->db_host = $db_host;
        $this->db_user = $db_user;
        $this->db_pass = $db_pass;
        $this->db_base = $db_base;
        $this->setConnect();
    }

    public function setConnect()
    {
        $this->db = new mysqli($this->db_host, $this->db_user, $this->db_pass, $this->db_base);
    }
    public function getConnect(){
        return $this->db;
    }
}

//todo mysqli real escape string
/** The Main Class **/
class main implements dB
{
    private $dataAdapter;
    private $db;
    private $db_host = 'localhost';
    private $db_user = 'logano8r_run';
    private $db_pass = 'runnerHaze';
    private $db_base = 'logano8r_run';


    private $app_id = '6059897';
    private $api_secret = 'GbTu5qPYupGmE1q8ML5j';
    private $service_token = '69f6a75969f6a75969f6a7591169aad020669f669f6a75930c5971f9ace2f50c59a05b3';
    private $api_settings = 'offline';
    private $auth_fields ='first_name, last_name, photo_200, photo_50,domain';
    private $auth_name_case='Nom';

    private $key = 'hse';
    private $salt = 'run';

    /** DB connection **/
    //init db
    public function __construct()
    {
        $this->dataAdapter = new dataBase($this->db_host,$this->db_user, $this->db_pass,$this->db_base);
        $this->db = $this->dataAdapter->getConnect();
    }

    //Makes db requests
    public function dbQuery($query, $type = MYSQLI_USE_RESULT)
    {
        if (!isset($this->db)) {
            $this->db = $this->dataAdapter->getConnect();
        }
        if (mysqli_connect_errno()) {
            printf("Can't connect: %s\n", mysqli_connect_error());
            exit();
        }

        $this->db->set_charset("utf-8");
        return $this->db->query($query, $type);
    }

    //Make secure db requests
    public function dbBindedQuery($query, $type, $params, $store_res = MYSQLI_USE_RESULT){
        if(!isset($this->db)){
            $this->db = $this->dataAdapter->getConnect();
        }

        if(mysqli_connect_errno()){
            printf("Can't connect %s\n", mysqli_connect_error());
            exit();
        }

        $this->db->set_charset("utf-8");

        $stmt = $this->db->prepare($query);

        if(is_array($params))
            call_user_func_array(array($stmt,"bind_param"),array_merge(array($type),$params));
        else
            $stmt->bind_param($type,$params);

        $stmt->execute();
        if($store_res==MYSQLI_STORE_RESULT){
            $stmt->store_result();
        }
        return $stmt->get_result();
    }


    /** GET SITE STATUS**/
    public function init_site()
    {
        $query = "SELECT * FROM hse_options WHERE name='site_closed'";
        $request = $this->dbQuery($query,MYSQLI_STORE_RESULT);
        $data = $request->fetch_assoc();

        if($data['autoload']==1) {
            return filter_var($data['value'],FILTER_VALIDATE_BOOLEAN);
        } else
            return false;
    }

    /** SET SITE STATUS */
    public function setStatus($status){
        if($this->checkVk()&&$_SESSION['user_group']=="admin"){
            $this->dbBindedQuery("UPDATE hse_options SET value=? WHERE name='site_closed'","s",$status);
            return $this->db->affected_rows;
        }
        return false;
    }

    /** VK authentification**/
    //Makes requests to VK servers
    public function authVk($u_ip,$callback_url, $code)
    {
        if ($this->checkVk()) {
            return API_ok;
        } else {
            $vk_config = array(
                'app_id' => $this->app_id,
                'api_secret' => $this->api_secret,
                'callback_url' => $callback_url,
                'api_settings' => $this->api_settings
            );
            try {
                $vk = new VK\VK($vk_config['app_id'], $vk_config['api_secret']);
                if (!isset($code)) {
                    return $vk->getAuthorizeURL($vk_config['api_settings'], $vk_config['callback_url']);
                } else {
                    $access_token = $vk->getAccessToken($code, $vk_config['callback_url']);
                    $user_info = $vk->api('users.get', array(
                        'users_id' => $access_token['user_id'],
                        'fields' => $this->auth_fields,
                        'name_case' => $this->auth_name_case
                    ));
                    return $this->setUser($u_ip,$user_info, $access_token['access_token']);
                }
            } catch (VK\VKException $error) {
                return $error->getMessage();
            }
        }
    }

    //Sets user's session data
    private function setUser($u_ip,$user_info, $token)
    {
        $gen = $this->genKeys();
        foreach ($user_info['response'] as $key => $value) {
            $_SESSION['session_id'] = $gen;
            $_SESSION['lastname'] = $value['last_name'];
            $_SESSION['firstname'] = $value['first_name'];
            $_SESSION['photo'] = $value['photo_200'];
            $_SESSION['photo_50'] = $value['photo_50'];
            $_SESSION['domain'] = $value['domain'];
            $_SESSION['LAST_ACTIVITY']=time();
            setcookie("sess",md5(microtime().rand()));
            return $this->authUser($u_ip,$value['uid'], $token, $gen, $value['last_name'], $value['first_name'], $value['photo_200'],$value['photo_50'],$value['domain']);
        }
        return API_bad;
    }

    //Installs user's data into HSE RUN db
    private function authUser($u_ip, $user_id, $access_token, $session_id, $lastname = "", $firstname = "", $photo = "", $photo_50="", $domain="")
    {
        $ip = ip2long($u_ip);
        settype($ip,"integer");
        settype($user_id,"integer");
        $q = "SELECT id FROM hse_users WHERE id=?";
        $d = $this->dbBindedQuery($q,"i",$user_id);
        if(!$d)
            return API_bad;
        if ($d->num_rows > 0) {
            $q = "UPDATE hse_users SET access_token=?, photo=?, photo_50=?, session_id=?, ip=?, domain=? WHERE id=?";
            $this->dbBindedQuery($q, "ssssisi", array(&$access_token,&$photo,&$photo_50,&$session_id,&$ip,&$domain,&$user_id));
        } else {
            $q = "INSERT INTO `hse_users` (`id`, `session_id`,`domain`, `ip`, `access_token`, `lastname`, `firstname`,`photo`,`photo_50`,`ans_true_false`,`ans_quest`,`reg_time`) VALUES (?,?,?,?,?,?,?,?,?, '{}', '{}',Now())";
            $this->dbBindedQuery($q,"ississsss",array(&$user_id,&$session_id,&$domain,&$ip,&$access_token,&$lastname,&$firstname,&$photo,&$photo_50));
        }
        $q = "SELECT last_login,done_tasks,is_banned, user_group, ans_true_false, ans_quest, score FROM hse_users WHERE id=?";
        $data = $this->dbBindedQuery($q, "i",$user_id);
        if(!$data)
            return API_bad;
        while ($obj = $data->fetch_array(MYSQLI_ASSOC)) {
            $_SESSION['last_login']=$obj['last_login'];
            $_SESSION['banned']=$obj['is_banned'];
            if($_SESSION['banned']>0)
                return API_banned;
            $_SESSION['ans_true_false'] = $obj['ans_true_false'];
            $_SESSION['ans_quest'] = $obj['ans_quest'];
            $_SESSION['score'] = $obj['score'];
            $_SESSION['done_tasks'] = $obj['done_tasks'];
            $_SESSION['user_group']=$obj['user_group'];
        }
        return API_ok;
    }

    //Checks the auth status
    public function checkVk()
    {
        if (isset($_SESSION['session_id'])) {
            $q = "SELECT ip,is_banned FROM hse_users WHERE session_id=?";
            $data = $this->dbBindedQuery($q,"s",$_SESSION['session_id']);
            $arr = $data->fetch_array();
            setcookie('done_tasks',$_SESSION['done_tasks']);
            setcookie('score',$_SESSION['score']);
            return ip2long($this->get_ip())==intval($arr['ip'])&&$arr['is_banned'] == 0;
        } else {
            return false;
        }
    }

    //Logs out the user
    public function destroyVk()
    {
        $this->dbBindedQuery("UPDATE hse_users SET access_token='', session_id='' WHERE session_id=?", "s",$_SESSION['session_id']);
        SessionManager::killSession();
        unset($_COOKIE['score']);
        unset($_COOKIE['done_tasks']);
        setcookie("score",null,-1,'/');
        setcookie("done_tasks",null,-1,'/');
        return API_not_auth;
    }

    /** TOP List **/
    public function getUserList($param, $order){
        if($this->checkVk()) {
            $q_count = $this->dbQuery('SELECT id FROM hse_users ORDER BY score ASC', MYSQLI_STORE_RESULT);

            $result = array();

            $result[] = $q_count->num_rows;
            $q_count->close();

            $q_count = $this->dbQuery("SELECT last_login FROM hse_users ORDER BY last_login DESC",MYSQLI_STORE_RESULT);
            $res = $q_count->fetch_assoc();
            $result[] = $res['last_login'];
            $q_count->close();

            $q_count = $this->dbQuery("SELECT ROUND(AVG(score),-1) as score_avg FROM hse_users",MYSQLI_STORE_RESULT);
            $res = $q_count->fetch_assoc()['score_avg'];
            $result[] = $res;
            $q_count->close();

            unset($res);

            if (empty($order) || $order != "DESC") {
                $order = "ASC";
            }
            if (empty($param) || $param != "score") {
                $param = "id";
            }
            $q_list = $this->dbQuery("SELECT * FROM hse_users ORDER BY $param $order");
            $result[] = array();
            while ($obj = $q_list->fetch_assoc()) {
                $p = array();
                $f = array();
                $f[] = json_decode($obj['ans_true_false'], true);
                $f[] = json_decode($obj['ans_quest'], true);

                $p[] = $obj['id'];
                $p[] = $obj['session_id'];
                $p[] = $obj['user_group'];
                $p[] = $obj['photo_50'];
                $p[] = $obj['lastname'];
                $p[] = $obj['firstname'];
                $p[] = $obj['score'];
                $p[] = $obj['done_tasks'];
                $p[] = $f;
                $p[] = $obj['last_login'];
                $p[] = $obj['is_banned'];

                $result[3][] = $p;
            }
            unset($f);
            unset($obj);
            unset($p);
            return json_encode($result);
        }
        return API_bad;
    }

    public function getMessages(){
        if($this->checkVk()) {
            $q_count = $this->dbQuery('SELECT id FROM hse_messages ORDER BY id ASC', MYSQLI_STORE_RESULT);

            $result = array();

            $result[] = $q_count->num_rows;
            $q_count->close();
            $q_list = $this->dbQuery("SELECT * FROM hse_messages ORDER BY id DESC");
            $result[] = array();
            while ($obj = $q_list->fetch_assoc()) {
                $p = array();

                $p[] = $obj['id'];
                $p[] = $obj['sender_id'];
                $p[] = $obj['message'];
                $p[] = $obj['parameters'];
                $p[] = $obj['created_at'];

                $result[1][] = $p;
            }
            unset($f);
            unset($obj);
            unset($p);
            return json_encode($result);
        }
        return API_bad;
    }
    /** Quest HSERUN **/

    //get all markers and tests, js will set them up depending on user
    public function setUpMarkers()
    {
        $q1="SELECT id,name,picture,address,lat,text,lng,task,fact,line FROM hse_quest WHERE line='1'";
        $q2="SELECT id,name,picture,address,lat,text,lng,task,fact,line FROM hse_quest WHERE line='2'";

        $ans_tf = json_decode($_SESSION['ans_true_false'],true);
        $ans_q = json_decode($_SESSION['ans_quest'],true);

        $f = $this->dbQuery($q1);
        $data1=array();
        while($d1 = $f->fetch_array(MYSQLI_ASSOC)){
            if(!isset($ans_tf['id'.$d1['id']])) {
                unset($d1['text']);
                unset($d1['fact']);
            }
            $data1[]=$d1;
        }
        $f=$this->dbQuery($q2);
        $data2=array();
        while($d2 = $f->fetch_array(MYSQLI_ASSOC)){
            if(!isset($ans_q['id'.$d2['id']])) {
                unset($d2['text']);
                unset($d2['fact']);
            }
            $d2['task']=json_decode($d2['task'],true);
            $data2[]=$d2;
        }

        $data=array('first'=>$data1,'second'=>$data2, 'ans_true_false'=>$ans_tf, 'ans_quest'=>$ans_q);

        return json_encode($data);
    }

    //Checks if the selected answer is right
    public function check_Answer($task_id, $type, $answer)
    {
        if($this->checkVk()) {
            //get answer from quest by id and type
            settype($task_id,"integer");
            $q = "SELECT answer,text,fact FROM hse_quest WHERE id=?";
            $p = $this->dbBindedQuery($q, "i", $task_id);
            //proceed the user's answer
            while ($obj = $p->fetch_assoc()) {
                $the_ans = $obj['answer'];
                $return = array();

                if ($type == '1') {
                    $_type = json_decode($_SESSION['ans_true_false'], true);
                } else if ($type == '2') {
                    $_type = json_decode($_SESSION['ans_quest'], true);
                }
                $t_str = (string) $task_id;
                if (!isset($_type['id' . $t_str])) {
                    $is_right = $this->compareTo($the_ans, $answer, $type);
                    if (!$this->update_User($t_str, $is_right, $type))
                        return json_encode(array(API_bad));
                    $return[] = ($is_right) ? good_ans : bad_ans;
                    $return[] = $obj['text'];
                    $return[] = $obj['fact'];
                    if ($type == '1') {
                        $_type = json_decode($_SESSION['ans_true_false'], true);
                    } else if ($type == '2') {
                        $_type = json_decode($_SESSION['ans_quest'], true);
                    }
                    $return[]=$_type;
                    setcookie("score", $_SESSION['score']);
                    return json_encode($return);
                } else
                    return json_encode(array(API_bad));
            }
            return json_encode(array(bad_ans));
        }
        return json_encode(array(bad_ans));
    }

    //compares user answer
    private function compareTo($main_answer, $user_answer, $type){
        if($type=='1'||$type=='2')
            return strcmp($main_answer,$user_answer)==0;
        else {
            return false;
        }
    }

    //Checks if the task is already done
    public function check_ifDone($task_id, $type){
        return isset(json_decode(($type=='1')?$_SESSION['ans_true_false']:$_SESSION['ans_quest'],true)['id'.$task_id]);
    }

    //Returns user score
    public function getUserScore($type){
        switch($type){
            case 'db': return $this->dbBindedQuery("SELECT score FROM hse_users WHERE session_id=?","s",$_SESSION['session_id'])->fetch_assoc()['score']; break;
            case 'sess': return $_SESSION['score']; break;
            default: return API_bad;
        }
    }

    //Updates users info 'bout score, done tasks if the answer is right
    private function update_User($task_id, $is_right, $type)
    {
        $text = $this->changeUserProgress($task_id, $is_right, $type);
        $q = "UPDATE hse_users SET ".$text." WHERE session_id=?";
        $request = $this->dbBindedQuery($q,"s",$_SESSION['session_id']);
        return $this->db->affected_rows;
    }

    //changes the user's done questions
    private function changeUserProgress($task_id, $is_right, $type){
        $ty = "ans_true_false";
        switch($type){
            case '1': $ty="ans_true_false"; break;
            case '2': $ty="ans_quest"; break;
            default: return false;
        }
        $q = "SELECT ".$ty." FROM hse_users WHERE session_id=?";
        $request = $this->dbBindedQuery($q,"s", $_SESSION['session_id']);
        $a = json_decode($request->fetch_assoc()[$ty],true);
        if(!isset($a['id'.$task_id])) {
            $a['id' . $task_id] = ($is_right) ? 'true' : 'false';
        }
        $_SESSION[$ty]=json_encode($a);
        $_SESSION['done_tasks']=intval($_SESSION['done_tasks'])+1;
        $text=$ty."='".$_SESSION[$ty]."', done_tasks='".intval($_SESSION['done_tasks'])."'";
        if($is_right) {
            $_SESSION['score'] = intval($_SESSION['score']) + 10;
            $text= "score='".$_SESSION['score']."', ".$text;
        }
        return $text;
    }

    //resets user's data
    public function flushUserData(){
        $_SESSION['ans_true_false']="{}";
        $_SESSION['ans_quest']="{}";
        $_SESSION['score']=0;
        $_SESSION['done_tasks']=0;
        setcookie("score","0");
        setcookie("done_tasks","0");
        setcookie("sess",$_SESSION['session_id']);
        $q = "UPDATE hse_users SET ans_true_false='{}', ans_quest='{}', score='0', done_tasks='0' WHERE session_id=?";
        if($this->dbBindedQuery($q,"s",$_SESSION['session_id']))
            return API_ok;
        else
            return API_bad;
    }

    //applying user's msg to db
    public function sendMessage($message){
        $q = "INSERT INTO hse_messages(`sender_id`,`message`,`parameters`) VALUES((SELECT id FROM hse_users WHERE session_id=?),?,'test_msg')";
        $this->dbBindedQuery($q,"ss",array(&$_SESSION['session_id'],&$message), MYSQLI_STORE_RESULT);
        if($this->db->insert_id)
            return API_ok;
        else
            return API_bad;
    }

    public function sendUnsignedMessage($name, $message){
        $q = "INSERT INTO hse_messages(`sender_id`,`message`,`parameters`) VALUES('0',?,?)";
        $this->dbBindedQuery($q,"ss",array(&$message,&$name), MYSQLI_STORE_RESULT);
        if($this->db->insert_id)
            return API_ok;
        else
            return API_bad;
    }
    //gets clients ip
    public function get_ip()
    {
        if (!empty($_SERVER['HTTP_CLIENT_IP']))
        {
            $ip=$_SERVER['HTTP_CLIENT_IP'];
        }
        elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR']))
        {
            $ip=$_SERVER['HTTP_X_FORWARDED_FOR'];
        }
        else
        {
            $ip=$_SERVER['REMOTE_ADDR'];
        }
        return $ip;
    }
    //generates keys
    private function genKeys($length=8){
        $chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGIK1234567890';
        $numChars = strlen($chars);
        $keystr = '';
        for($i=0; $i<$length; $i++)
            $keystr .= substr($chars, rand(1,$numChars)-1,1);
        return mb_substr($this->key.$this->salt.hash_hmac('ripemd160', $keystr,$this->key),0,13);
    }
}
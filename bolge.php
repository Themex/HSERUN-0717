<?php
/**
 * Created by Bølge Creations.
 * @author Artyom Kamensky
 * Date: 02.07.2017
 * Time: 21:15
 */
define("INCLUDE_CHECK", true);
include("hserun.php");
function makeAuthRequest($act_link, $main_link){
    $main = new main();
    $major = $main->authVk($main->get_ip(),$act_link, $_GET['code']);
    if (filter_var($major, FILTER_VALIDATE_URL, FILTER_FLAG_PATH_REQUIRED)) {
        echo $major;
    } elseif ($major == API_ok) {
        header('Location:' . $main_link);
    } else {
        echo make_exception($major);
    }
}
function make_exception($ma)
{
    return "Something's gone wrong: " . explain_msg($ma);
}

function explain_msg($err_code){
    switch($err_code){
        case API_ok: return 'All is good'; break;
        case API_empty_request: return "You've sent an empty request."; break;
        case API_not_auth: return "You're not authorized to do that"; break;
        case API_banned: return "You're banned!"; break;
        default: return $err_code;
    }
}

/** non-AJAX's requests**/
if(isset($_GET['code'])){
    makeAuthRequest(actual_link,main_link);
}

/** AJAX's requests**/
if(!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {
    $type = $_POST['type'];
    $task_id = $_POST['task_id'];
    $task_type = $_POST['task_type'];
    $task_answer = $_POST['answer'];
    $u_msg = $_POST['message'];
    $name = $_POST['name'];
    $status = $_POST['status'];
    $main = new main();
    if ($type == 'auth') {
        makeAuthRequest(actual_link,main_link);
    } elseif($type == 'init'&&isset($status)){
        echo ($main->setStatus($status))?API_ok:API_bad;
    } elseif ($type == 'list') {
        echo $main->getUserList("score", "DESC");
    } elseif ($type == 'messages'){
        echo $main->getMessages();
    } elseif ($type == 'check') {
        echo ($main->checkVk()) ? API_ok : API_bad;
    } elseif ($type == 'logout') {
        echo $main->destroyVk();
    } elseif ($type == 'setup' && $main->checkVk()) {
        echo $main->setUpMarkers();
    } elseif ($type == 'getAnswer'&&isset($task_id)&&isset($task_type)&&isset($task_answer)){
        echo $main->check_Answer($task_id,$task_type,$task_answer);
    } elseif ($type == 'getScore') {
        echo $main->getUserScore('sess');
    } elseif ($type == 'flush'){
        echo $main->flushUserData();
    } elseif ($type == 'sendMsg'&&isset($u_msg)){
        echo $main->sendMessage($u_msg);
    } elseif ($type == 'sendUMsg'&&isset($u_msg)&&isset($name)){
        echo $main->sendUnsignedMessage($name,$u_msg);
    } else {
        echo API_empty_request;
    }
}
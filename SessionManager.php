<?php

/**
 * Created by PhpStorm.
 * User: Theme
 * Date: 16.07.2017
 * Time: 10:17
 */
if(!defined('INCLUDE_SECURE')) die('Access denied');
class SessionManager
{
    static function sessionStart($name, $limit=0, $path='/',$domain = null, $secure = null, $activity = 86400){
        session_name($name.'_Session');

        $domain = isset($domain) ? $domain : isset($_SERVER['SERVER_NAME']);

        $https = isset($secure) ? $secure : isset($_SERVER['HTTPS']);

        ini_set('session.gc_maxlifetime', $activity*2);
        session_set_cookie_params($limit, $path, $domain, $https, true);
        session_start();

        if(self::validateSession())
        {
            // Check to see if the session is new or a hijacking attempt
            if(!self::preventHijacking())
            {
                // Reset session data and regenerate id
                $_SESSION = array();
                $_SESSION['IPaddress'] = self::get_ip();
                $_SESSION['userAgent'] = $_SERVER['HTTP_USER_AGENT'];
                self::regenerateSession();

                // Give a 5% chance of the session id changing on any request
            }elseif(rand(1, 100) <= 5){
                self::regenerateSession();
            }
        }else{
            $_SESSION = array();
            session_destroy();
            session_start();
        }
    }


    static function preventHijacking(){
        if(!isset($_SESSION['IPaddress'])||!isset($_SESSION['userAgent']))
            return false;
        //todo redo with get_ip()
        if($_SESSION['IPaddress']!=self::get_ip())
            return false;

        if($_SESSION['userAgent']!=$_SERVER['HTTP_USER_AGENT'])
            return false;

        return true;
    }

    static function regenerateSession($invalidate = null){
        if(isset($_SESSION['OBSOLETE']) || $_SESSION['OBSOLETE'] == true)
            return;

        $_SESSION['OBSOLETE'] = true;
        $_SESSION['EXPIRES'] = time() + 10;

        session_regenerate_id(isset($invalidate) ? $invalidate : false);

        $newSession = session_id();
        session_write_close();

        session_id($newSession);
        session_start();

        unset($_SESSION['OBSOLETE']);
        unset($_SESSION['EXPIRES']);
    }

    static protected function validateSession(){
        if( isset($_SESSION['OBSOLETE']) && !isset($_SESSION['EXPIRES']) )
            return false;

        if(isset($_SESSION['EXPIRES']) && $_SESSION['EXPIRES'] < time())
            return false;

        return true;
    }

    static function killSession(){
        session_destroy();
        session_unset();
    }

    static private function get_ip()
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
        return ip2long($ip);
    }
}
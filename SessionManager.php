<?php
if(!defined('INCLUDE_SECURE')) die('Access denied');
/*
Copyright (c) 2009, Robert Hafner
All rights reserved.
Redistribution and use in source and binary forms, with or without modification, are permitted provided that the
following conditions are met:
    * Redistributions of source code must retain the above copyright notice, this list of conditions and the following
      disclaimer.
    * Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the
      following disclaimer in the documentation and/or other materials provided with the distribution.
    * Neither the name of the <ORGANIZATION> nor the names of its contributors may be used to endorse or promote
      products derived from this software without specific prior written permission.
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES,
INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
/**
 * This SessionManager starts starts the php session (regardless of which handler is set) and secures it by locking down
 * the cookie, restricting the session to a specific host and browser, and regenerating the ID.
 *
 */
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

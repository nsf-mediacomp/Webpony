import json
import socketserver
import socket
import re
import time
import urllib.parse

host = "" #127.0.0.1
port = 27182 # 80

# adapted from http://hg.python.org/cpython/file/3.3/Lib/http/server.py

def utc_now():
    return int(round(time.time() * 1000))
    

class DrawrRoom():
    def __init__(self):
        self.objects = []

    def post(self,json_str):
        #this is a race condition isn't it?
        #should only result in a minor graphical bug, if so
        self.objects.append(json_str)
        return str(len(self.objects) - 1)

    def check(self):
        return str(len(self.objects) - 1)

    def get(self,after_id):
        # slice the array, then format it as a json list
        after_id = int(after_id)
        return "[" + ",".join(self.objects[after_id+1:]) + "]"

    def clear(self):
        self.objects = []
        return "0"

class DrawrRoomsHolder():
    rooms = {}

    def post(room,json_str):
        if room not in DrawrRoomsHolder.rooms:
            DrawrRoomsHolder.rooms[room] = DrawrRoom()
        return DrawrRoomsHolder.rooms[room].post(json_str)

    def check(room):
        if room not in DrawrRoomsHolder.rooms:
            DrawrRoomsHolder.rooms[room] = DrawrRoom()
        return DrawrRoomsHolder.rooms[room].check()

    def get(room,after_id):
        if room not in DrawrRoomsHolder.rooms:
            DrawrRoomsHolder.rooms[room] = DrawrRoom()
        return DrawrRoomsHolder.rooms[room].get(after_id)

    def clear(room):
        if room not in DrawrRoomsHolder.rooms:
            DrawrRoomsHolder.rooms[room] = DrawrRoom()
        return DrawrRoomsHolder.rooms[room].clear()

def strip_path(p):
    p = re.sub(r'^http:\/\/','',p)
    p = re.sub(r'^.*\/','',p)
    return p

class DrawrHandler(socketserver.StreamRequestHandler):

    """
    Instantiated once per connection to the server.
    """

    def route(self):
        #### below, r is current time to prevent caching
        #### 
        # requests possible: /post?r&room&json_of_new_object(s?)
        #    - replies with update id
        # /check?r&room
        #    - replies with latest id
        # /get?r&room&updates_after_this_id
        #    - replies with JSON list of new objects from all client
        #      that are not the requesting client
        # add /clear?r&room
        #    - returns 0

        parse_path_str = self.path
        parse_path_str = re.sub(r'^https?:\/\/[^\/]*', '', parse_path_str)
        parse_path_str = re.sub(r'^\/+', '', parse_path_str)

        match = re.match(r'([a-z]+)\?(.*)$', parse_path_str)
        if not match:
            self.send_error(404, "Invalid Request")

        if match.group(1) == 'post':
            post_match = re.match(r'^[^&]+&([^&]*)&(.*)$', match.group(2))
            if not match: self.send_error(404, "Invalid Request")
            room = post_match.group(1)
            json_str = post_match.group(2)
            print("POST: " + urllib.parse.unquote(json_str))
            response = DrawrRoomsHolder.post(room, json_str)
            self.send_response(response)
            
        elif match.group(1) == 'check':
            post_match = re.match(r'^[^&]+&(.*)$', match.group(2))
            if not match: self.send_error(404, "Invalid Request")
            room = post_match.group(1)
            response = DrawrRoomsHolder.check(room)
            self.send_response(response)
            
        elif match.group(1) == 'get':
            post_match = re.match(r'^[^&]+&([^&]*)&(.*)$', match.group(2))
            if not match: self.send_error(404, "Invalid Request")
            room = post_match.group(1)
            after_id = post_match.group(2)
            response = DrawrRoomsHolder.get(room, after_id)
            print("GET: " + urllib.parse.unquote(response))
            self.send_response(response)
            
        elif match.group(1) == 'clear':
            post_match = re.match(r'^[^&]+&(.*)$', match.group(2))
            if not match: self.send_error(404, "Invalid Request")
            room = post_match.group(1)
            response = DrawrRoomsHolder.clear(room)
            self.send_response(response)

        else:
            self.send_error(404, "Invalid Request")
            

    def parse_and_do_request(self):

        # HTTP requests are of the form:
        # <command> <path> <version>
        # with spaces appearing only between those, and <path> url encoded
        # command is case sensitive GET, POST, etc.
        # version can be ignored because doesn't matter here

        # All of the data this server will read will be in the <path>
        # passed as CGI arguments after a "?" added to the requested path

        self.close_connection = 0 # changed later depending on command MAYBEEE

        words = self.requestline.split()
        print(self.requestline.decode(encoding="UTF-8"))

        for i in range(0,len(words)):
            words[i] = words[i].decode(encoding="UTF-8")

        if len(words) not in [2,3]:
            self.send_error(404, "Invalid Request");
            return False

        self.command = words[0]
        self.path = words[1]

        if self.command == "GET":
            self.route()
            #####
            #self.send_response(self.path.upper())
            #print(self.path.upper())
        else:
            self.send_error(404, "Invalid Request - only GET supported")
            return False

    def handle_one_request(self):
        try:
            self.requestline = self.rfile.readline().strip()
            if not self.requestline:
                self.close_connection = 1
                return
            if not self.parse_and_do_request():
                # An error code has been sent, just exit
                self.close_connection = 1
                return
            self.wfile.flush()
        except socket.timeout as e:
            # a read or write timed out. Discard connection
            self.close_connection = 1
            return
    
    def handle(self):
        """Handle multiple HTTP requests if necessary"""
        self.close_connection = 1

        print("got connection")

        self.handle_one_request()
        while not self.close_connection:
            self.handle_one_request()

        print("a connection closed\n")


    def send_error(self, code, message="Error"):
        body = "error. " +str(code) + " " + message + "\n";
        
        self.wfile.write(("HTTP/1.1 " + str(code) + " " + message + """
Content-Type: text/html; charset=utf-8
Content-Length: """ + str(len(body)) + """
Access-Control-Allow-Origin: *
Cache-Control: no-cache, no-store, must-revalidate
Pragma: no-cache
Expires: 0
Connection: close

""" + body).encode('UTF-8'))
        return


    def send_response(self, body):
        self.wfile.write(("""HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8
Content-Length: """ + str(len(body)) + """
Access-Control-Allow-Origin: *
Cache-Control: no-cache, no-store, must-revalidate
Pragma: no-cache
Expires: 0
Connection: keep-alive

""" + body).encode('UTF-8'))


######################
if __name__ == "__main__":
    server = socketserver.TCPServer((host,port), DrawrHandler)

    server.serve_forever()

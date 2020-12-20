1)GET REQUEST WITH PARAMETERS
Functionality: 
Route: 
Request type: POST
Parameters:
Example of how to call route:
Response:
*Note:
Request Header: KEY:Authorization & VALUE: access token from login repsonse
Request Header Params: includes payload object which is provided at token verification and has id,type & email of logged in staff member

2)POST REQUEST 
Functionality: 
Route: 
Request type: POST
RequestBody:
{..insert body..}
Response:
*Note:
Request Header: KEY:Authorization & VALUE: access token from login repsonse
Request Header Params: includes payload object which is provided at token verification and has id,type & email of logged in staff member

3)GET REQUEST WITHOUT PARAMETERS
Functionality: 
Route: 
Request type: POST
Response:
*Note:
Request Header: KEY:Authorization & VALUE: access token from login repsonse
Request Header Params: includes payload object which is provided at token verification and has id,type & email of logged in staff member

//////////////////////////////////////////////////////////////////////////////////////////////////

A)Running Information:
    Run npm start command in milestone-1-Team-62
    Folder to run: server.js
    Port: 3000

B)Functionalities:

    2)GUC Staff Member Functionalities:

        a)Log in with unique email and password
            Functionality: login staff member into the system
            Route: /login
            Request type: POST
            RequestBody:
            {"email":"staff@guc.edu.eg",
             "password":"1234"}
            Response: access token and refresh token
            {
                "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InN0YWZmQGd1Yy5lZHUuZWciLCJ0eXBlIjoiSFIiLCJpZCI6IjEiLCJpYXQiOjE2MDg0NjI5MTMsImV4cCI6MTYwODQ2MzUxM30.rjCTriyocNc09OpbmVcpj9SMqlHMPomBRONH0jJWE7s",
                "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InN0YWZmQGd1Yy5lZHUuZWciLCJ0eXBlIjoiSFIiLCJpZCI6IjEiLCJpYXQiOjE2MDg0NjI5MTN9.XSI0Bbr2fmX95dY8ZOoykgZxucMmcmUzbRGWM3iX0uQ"
            }

        b)Log out from the system 
            Functionality: logout as a staff member from the system
            Route: /logout
            Request type: POST
            RequestBody: includes refresh token which is sent as response from login
            {"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InN0YWZmQGd1Yy5lZHUuZWciLCJ0eXBlIjoiSFIiLCJpZCI6IjEiLCJpYXQiOjE2MDg0NTgyNDB9.q6iEnOuD48Riiz_DuqdgofyPOyQD7lu-v9M7XbRHB9w""}
            Response: message indicating successfull log out
            Logout successful
            *Note:
            Request Header: must include Authorization header with value equal to access token which is sent as response from login
            KEY:Authorization & VALUE:eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InN0YWZmQGd1Yy5lZHUuZWciLCJ0eXBlIjoiSFIiLCJpZCI6IjEiLCJpYXQiOjE2MDg0NTgyNDAsImV4cCI6MTYwODQ1ODg0MH0.CxTsXjJ1Zl_t4YFgee6w86PiUwqTgZOq4c8xaA2T7ZQ 

        c)View their profile
            Functionality: any staff member can view their own profile
            Route: /staffMember/viewProfile
            Request type: GET      
            Response:
            {
                "acceptedLeaves": [],
                "firstLogin": false,
                "_id": "5fd677eea0a2e17680c75a2d",
                "email": "staff@guc.edu.eg",
                "type": "HR",
                "password": "$2a$10$RG7TFPVos9a62yfFjK.XD.hcvqoCPkttDctoNV0SYwdLozP5a6ABG",
                "username": "staffMem",
                "salary": 2000,
                "name": "staffMemUpdated",
                "id": "1",
                "mobileNumber": "1",
                "officeLocation": "a",
                "dayOffNumber": 0
            }
            *Note:
            Request Header: KEY:Authorization & VALUE: access token from login repsonse
            Request Header Params: includes payload object which is provided at token verification and has id,type & email of logged in staff member

        d)Update their profile 
            Functionality: update their mobile number or email.
            Route: /updateProfile
            Request type: POST
            RequestBody: can include only one of them 
            {"email":"staff@guc.edu.eg",
             "mobileNumber":"12345678"}
            Response: updated staff member record
            {
                "acceptedLeaves": [],
                "firstLogin": false,
                "_id": "5fd677eea0a2e17680c75a2d",
                "email": "staff@guc.edu.eg",
                "type": "HR",
                "password": "$2a$10$J8fqbTyi0jRLs8vSELYeT.KghLRNKEf3xN/i8aJBqXvoJeJuZZJZ6",
                "username": "staffMem",
                "salary": 2000,
                "name": "staffMemUpdated",
                "id": "1",
                "mobileNumber": "1234",
                "officeLocation": "a",
                "dayOffNumber": 0
            } 
            *Note:
            Request Header: KEY:Authorization & VALUE: access token from login repsonse
            Request Header Params: includes payload object which is provided at token verification and has id,type & email of logged in staff member  

        e)Reset their passwords
            i)reset password
                Functionality: user can reset password in case forgotten 
                Route: /resetPassword
                Request type: POST
                RequestBody:
                {"email":"staff@guc.edu.eg"}
                Response: randomly generated one time password (OTP)
                MgS0Z7

            ii)change password 
                Functionality: user can change their password when they want to
                Route: /staffMember/changePassword
                Request type: POST
                RequestBody:
                {"password":"newPassword"}
                Response: message indicating successfull change of their password
                Password changed successfully                      
                *Note:
                Request Header: KEY:Authorization & VALUE: access token from login repsonse
                Request Header Params: includes payload object which is provided at token verification and has id,type & email of logged in staff member     

        f)Sign in 
            Functionality: staff can sign in indicating entering campus
            Route: /staffMember/signIn
            Request type: POST
            RequestBody: body is empty as data is provided from middleware when verifying access token
            {} 
            Response: updated attendance record with sign in date and time represented in UTC
            {
                "signIn": [
                    "2020-12-20T11:09:05.957Z"
                ],
                "signOut": [],
                "_id": "5fdf30d2e7c24f2da0b7bc3a",
                "id": "1",
                "date": "12/20/2020",
                "__v": 0
            }             
            *Note:
            Request Header: KEY:Authorization & VALUE: access token from login repsonse
            Request Header Params: includes payload object which is provided at token verification and has id,type & email of logged in staff member           

        g)Sign out 
            Functionality: staff can sign out indicating entering campus
            Route: /staffMember/signOut
            Request type: POST
            RequestBody: body is empty as data is provided from middleware when verifying access token
            {} 
            Response: updated attendance record with sign out date and time represented in UTC
            {
                "signIn": [
                    "2020-12-20T11:09:05.957Z"
                ],
                "signOut": [
                    "2020-12-20T11:09:39.621Z"
                ],
                "_id": "5fdf30d2e7c24f2da0b7bc3a",
                "id": "1",
                "date": "12/20/2020",
                "__v": 0
            }
            *Note:
            Request Header: KEY:Authorization & VALUE: access token from login repsonse
            Request Header Params: includes payload object which is provided at token verification and has id,type & email of logged in staff member  

        h)View all attendance record or can specify which month to view
            i)View all attendance records
                Functionality: view all attendance records
                Route: /staffMember/viewAllAttendance
                Request type: GET
                Response: array of attendance record each like the following                        
                {
                        "signIn": [
                            "2020-12-19T07:23:22.815Z"
                        ],
                        "signOut": [
                            "2020-12-19T18:23:22.815Z"
                        ],
                        "_id": "5fde09805b01d3369c512919",
                        "id": "1",
                        "date": "12/10/2020",
                        "__v": 0
                }
                *Note:
                Request Header: KEY:Authorization & VALUE: access token from login repsonse
                Request Header Params: includes payload object which is provided at token verification and has id,type & email of logged in staff member 

            ii)view attendance record in a specific month          
                Functionality: view attendance records in a specific month f a specific year
                Route: /staffMember/viewAttendance/:yearToView/:monthToView
                Request type: GET
                Parameters: monthToView is the month you want to view its attendance and yearToView is the year the month is in
                Example how to call route: /staffMember/viewAttendance/2020/12
                Response: array of attendance record each like the following                        
                {
                        "signIn": [
                            "2020-12-19T07:23:22.815Z"
                        ],
                        "signOut": [
                            "2020-12-19T18:23:22.815Z"
                        ],
                        "_id": "5fde09805b01d3369c512919",
                        "id": "1",
                        "date": "12/10/2020",
                        "__v": 0
                }
                *Note:
                Request Header: KEY:Authorization & VALUE: access token from login repsonse
                Request Header Params: includes payload object which is provided at token verification and has id,type & email of logged in staff member 

        i)View if they have missing days
            Functionality: view missing days in a specific month of a specific year
            Route: /staffMember/missingDays/:yearToView/:monthToView
            Request type: GET
            Parameters: monthToView is the month you want to view its missing days and yearToView is the year the month is in
            Example how to call route: /staffMember/missingDays/2020/12
            Response: array of dates of missing days each provided in UTC format like the following                        
            [
                "2020-12-12T22:00:00.000Z",
                "2020-12-14T22:00:00.000Z",
                "2020-12-15T22:00:00.000Z"
            ]
            *Note:
            Request Header: KEY:Authorization & VALUE: access token from login repsonse
            Request Header Params: includes payload object which is provided at token verification and has id,type & email of logged in staff member 

        j)View if they have missing hours or extra hours
            Functionality: view missing hours or extra hours in a specific month of a specific year
            Route: /staffMember/hours/:yearToView/:monthToView
            Request type: GET
            Parameters: monthToView is the month you want to view its missing/extra and yearToView is the year the month is in
            Example how to call route: /staffMember/hours/2020/12
            Response: missing hours and extra hours in specified month
            {
                "missingHours": 0,
                "extraHours": 3.7693511111111118
            }
            *Note:
            Request Header: KEY:Authorization & VALUE: access token from login repsonse
            Request Header Params: includes payload object which is provided at token verification and has id,type & email of logged in staff member

    3)HR Functionalities: /hr
        a)

        b)Faculty : 
            i) Add a Faculty
            Functionality: Adds a new Faculty
            Route: /addFaculty
            Request type: POST
            RequestBody: {"name":"FacultyNameExample"}
            Response: Info of Faculty as added to DB (_id is needed later for updating a Faculty)
            {
                "message": "Added Successfully",
                "data": {
                    "departments": [],
                    "_id": "5fdf588498dd31107d603f82",
                    "name": "FacultyNameExample",
                    "__v": 0
                }
            }

            ii) update a Faculty
            Functionality: Updated the Faculty Name
            Route: /editFaculty
            Request type: PUT
            RequestBody: {
                "_id": "5fdf61b607779c12abf3e7b9",
                "name":"FacultyNameUpdated2"
                }
            Response: {
                    "message": "edited Successfully",
                    "data": {
                        "departments": [],
                        "_id": "5fdf61b607779c12abf3e7b9",
                        "name": "FacultyNameUpdated3",
                        "__v": 0
                    }
                }

            iii) Delete a Faculty
            Functionality: Deletes a Faculty & its corresponding: academicMember record (Not the profile of the member just the record that he/she belonged to this faculty), courses, departments
            Route: /deleteFaculty
            Request type: DELETE
            RequestBody: {
                "name":"FacultyNameUpdated3"
                }
            Response: Faculty successfuly deleted

        c)Department:
        i) Add a Department
            Functionality: Adds a new Department & adds it to its corresponsing department if HOD is added will create an academic member for him/her with their corresponding faculty & department
            Route: /addDepartment
            Request type: POST
            RequestBody: {
                "faculty":"FacTrial",
                "department":"Dept",
                "HOD":"as-20"
                }
            Response:
            Successfully created
            *Note: faculty & department are required

            ii) update a Department
            Functionality: can update the Department HOD and/or Faculty 
            Route: /editFaculty
            Request type: PUT
            RequestBody: {
                "faculty":"Engineering",
                "department":"DeptNew",
                "HOD":"as-20"

                }
            Response: updated Successfully
            *Note: Faculty & department are required (if no updates are going to happen for the faculty, place its current faculty name)

            iii) Delete a Department
            Functionality: Deletes a Department & its corresponding: academicMember record (Not the profile of the member just the record that he/she belonged to this faculty), courses
            Route: /deleteDepartment
            Request type: DELETE
            RequestBody: {
                "faculty":"Engineering",
                "department":"Media03"
                }
            Response: Faculty successfuly deleted
            *Note: faculty & department are a must
        d)Course:
        i) Add a Course
            Functionality: Adds a new Course & adds it to its corresponsing department
            Route: /addCourse
            Request type: POST
            RequestBody: {
                "course":"aNewCourse",
            "department":"DeptNew"
            }
            Response:
            Course Added
            *Note: course & department are required

            ii) update a Course
            Functionality: can update the Department of the course Only (which will automatically update its corresponding faculty too)
            Route: /editCourse
            Request type: PUT
            RequestBody: {
            "course":"aNewCourse4",
            "department":"FarahDeptNew"

            }
            Response: success
            *Note: Faculty & department are required 

            iii) Delete a Course
            Functionality: Deletes a course & its corresponding: academicMember record (Not the profile of the member just the record that he/she belonged to this course), and its record in the department's courses list
            Route: /deleteCourse
            Request type: DELETE
            RequestBody:{
                    "course":"aNewCourse4"
                }
            Response: Deleted successfully
            
        e)

        f)
            
        g)

        h)

        i)

        j)

    4)Academic member functionalities:

        4.1)HOD Functionalities:

            a)

            b)

            c)

            d)
            
            e)

            f)
            
            g)

            h)

        4.2)Course Instructor Functionalities

            a)

            b)

            c)

            d)
            
            e)

            f)
            
            g)

        4.3)Course Coordinator Functionalities

            a)

            b)

            c)

        4.4)Academic Member Functionalities 

            a)

            b)

            c)

            d)
            
            e)

            f)
            
            g)

            h)                           
        

                      









    




HR

Add Location:
Inputs Ex:
"room":"c7.202",
"type":"tutorial",
"maxCapacity":0

DELETE Location:
Must input room
"room":"c7.202",
don't need haga tanya
...................................
/AddFaculty must have faculty name:
"name"
returns success & data of faculty (we need _id for updating)


/addDepratment:
takes :
    "name":"Media Dept",
    "courses":["mass","applied"],
    "HOD":"as-20",
    "faculty":"Engineering"

/editDepartment shouls take name & only the edited fields



.........Coordinator

Body of addSlot
{
    "course":"advanced",
    "day":"Thursday",
    "slot":"5",
    "instructor":"as-20",
    "location":"c7.202"

}
result successfully created


Body of editSlot
{"id":3,
    "course":"advanced",
    "day":"teysday",
    "slot":"5",
    "instructor":"as-20",
    "location":"c7.22"

}
result success message
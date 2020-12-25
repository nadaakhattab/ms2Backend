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
            {
                "email":"HR1@guc.edu.eg",
                "password":"123456"
            }
            Response: access token and refresh token
            {
                "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InN0YWZmQGd1Yy5lZHUuZWciLCJ0eXBlIjoiSFIiLCJpZCI6IjEiLCJpYXQiOjE2MDg0NjI5MTMsImV4cCI6MTYwODQ2MzUxM30.rjCTriyocNc09OpbmVcpj9SMqlHMPomBRONH0jJWE7s",
                "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InN0YWZmQGd1Yy5lZHUuZWciLCJ0eXBlIjoiSFIiLCJpZCI6IjEiLCJpYXQiOjE2MDg0NjI5MTN9.XSI0Bbr2fmX95dY8ZOoykgZxucMmcmUzbRGWM3iX0uQ"
            }

        b)Log out from the system 
            Functionality: logout as a staff member from the system
            Route: /staffMember/logout
            Request type: POST
            RequestBody: includes refresh token which is sent as response from login.
            Example:
            {"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InN0YWZmQGd1Yy5lZHUuZWciLCJ0eXBlIjoiSFIiLCJpZCI6IjEiLCJpYXQiOjE2MDg0NTgyNDB9.q6iEnOuD48Riiz_DuqdgofyPOyQD7lu-v9M7XbRHB9w""}
            Response: message indicating successfull log out
            Logout successful
            *Note:
            -Logout removes refresh token of the user from global.refreshTokens array, hence the user   wont be able to change access token when it expires and will be logged out.
            -Request Header: must include Authorization header with value equal to access token which is sent as response from login
            -KEY:Authorization & VALUE:eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InN0YWZmQGd1Yy5lZHUuZWciLCJ0eXBlIjoiSFIiLCJpZCI6IjEiLCJpYXQiOjE2MDg0NTgyNDAsImV4cCI6MTYwODQ1ODg0MH0.CxTsXjJ1Zl_t4YFgee6w86PiUwqTgZOq4c8xaA2T7ZQ 

        c)View their profile
            Functionality: any staff member can view their own profile
            Route: /staffMember/viewProfile
            Request type: GET      
            Response:
            {     
                "dayOff": "Saturday",
                "dayOffNumber": 6,
                "firstLogin": false,
                "annualLeaves": 0,
                "_id": "5fe5106f88ffe53449235269",
                "name": "HR#1",
                "email": "HR1@guc.edu.eg",
                "id": "hr-1",
                "gender": "female",
                "salary": 20000,
                "password": "$2a$10$9z8gYrEar.Z.iX6Xh2KfLuzv8u.iml08tFIXzDQNkQZjJKCKSX/zG",
                "officeLocation": "location-1",
                "type": "HR",
                "mobileNumber": "0120000",
                "__v": 0
            }
            *Note:
            Request Header: KEY:Authorization & VALUE: access token from login repsonse
            Request Header Params: includes payload object which is provided at token verification and has id,type & email of logged in staff member

        d)Update their profile 
            Functionality: update their mobile number or email.
            Route: /staffMember/updateProfile
            Request type: POST
            RequestBody:
            {
               "mobileNumber":"5555"
            }
            Response: updated staff member record
            {
                "dayOff": "Saturday",
                "dayOffNumber": 6,
                "firstLogin": false,
                "annualLeaves": 0,
                "_id": "5fe5106f88ffe53449235269",
                "name": "HR#1",
                "email": "HR1@guc.edu.eg",
                "id": "hr-1",
                "gender": "female",
                "salary": 20000,
                "password": "$2a$10$9z8gYrEar.Z.iX6Xh2KfLuzv8u.iml08tFIXzDQNkQZjJKCKSX/zG",
                "officeLocation": "location-1",
                "type": "HR",
                "mobileNumber": "5555",
                "__v": 0
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
                {
                "email":"HR1@guc.edu.eg",
                "password":"pass"
                }
                Response: message indicating successfull reset of their password
                "Successfull Reset"

            ii)update password 
                Functionality: user can update their password when they want to
                Route: /staffMember/updatePassword
                Request type: POST
                RequestBody:
                {
                "email":"HR1@guc.edu.eg",
                "password":"up1",
                "oldPassword":"pass"
                }
                Response: message indicating successfull change of their password
                "Password changed successfully"                      
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
                    "2020-12-24T23:24:47.740Z"
                ],
                "signOut": [],
                "_id": "5fe5233f599f5d9db8cae6f0",
                "id": "hr-1",
                "date": "12/25/2020",
                "__v": 0
            }            
            *Note:
            -Sign in time is represented in the database using UTC time.
            -Request Header: KEY:Authorization & VALUE: access token from login repsonse
            -Request Header Params: includes payload object which is provided at token verification and has id,type & email of logged in staff member           

        g)Sign out 
            Functionality: staff can sign out indicating entering campus
            Route: /staffMember/signOut
            Request type: POST
            RequestBody: body is empty as data is provided from middleware when verifying access token
            {} 
            Response: updated attendance record with sign out date and time represented in UTC
            {
                "signIn": [
                    "2020-12-24T23:24:47.740Z"
                ],
                "signOut": [
                    "2020-12-24T23:27:08.009Z"
                ],
                "_id": "5fe5233f599f5d9db8cae6f0",
                "id": "hr-1",
                "date": "12/25/2020",
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
                [
                    {
                        "signIn": [
                            "2020-12-24T23:24:47.740Z",
                            "2020-12-24T23:28:23.513Z"
                        ],
                        "signOut": [
                            "2020-12-24T23:27:08.009Z",
                            "2020-12-24T23:28:42.443Z"
                        ],
                        "_id": "5fe5233f599f5d9db8cae6f0",
                        "id": "hr-1",
                        "date": "12/25/2020",
                        "__v": 0
                    }
                ]
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
                        "2020-12-24T23:24:47.740Z",
                        "2020-12-24T23:28:23.513Z"
                    ],
                    "signOut": [
                        "2020-12-24T23:27:08.009Z",
                        "2020-12-24T23:28:42.443Z"
                    ],
                    "_id": "5fe5233f599f5d9db8cae6f0",
                    "id": "hr-1",
                    "date": "12/25/2020",
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
            Response: array of dates of missing days each provided in UTC format like the following:                        
            [
                "2020-12-12T22:00:00.000Z",
                "2020-12-13T22:00:00.000Z",
                "2020-12-14T22:00:00.000Z",
                "2020-12-15T22:00:00.000Z",
                "2020-12-16T22:00:00.000Z",
                "2020-12-19T22:00:00.000Z",
                "2020-12-20T22:00:00.000Z",
                "2020-12-21T22:00:00.000Z",
                "2020-12-22T22:00:00.000Z"
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
                "missingHours": 2.245778055555556,
                "extraHours": 0
            }
            *Note:
            Request Header: KEY:Authorization & VALUE: access token from login repsonse
            Request Header Params: includes payload object which is provided at token verification and has id,type & email of logged in staff member

    3)HR Functionalities: /hr
        a)Location:
            
            i) add a location
            Functionality: Adds a new location
            Route:/hr/addLocation
            Request type: POST
            RequestBody: 
            {
                "room": "h18",
                "type":"hall",
                "maxCapacity":25
            }
            Response:
            "Successfully Added" 

            ii) update a location
            Functionality: can updated name or max capac
            Route: /hr/editLocation
            Request type: PUT
            RequestBody:
            {
                "room": "location-3",
                "maxCapacity": "2" 
            }
            Response: 
            {
                "message": "Added Successfully",
                "data": {
                    "capacity": 0,
                    "_id": "5fe5261eb7501c68703179a7",
                    "room": "location-3",
                    "displayName": "h18",
                    "type": "hall",
                    "maxCapacity": 23,
                    "__v": 0
                }
           }


            iii) Delete a location
            Functionality: Deletes a location and sets the members with office location equal to this location to null
            Route: /hr/deleteLocation/:room
            Request type: DELETE
            Params:
            /hr/deleteLocation/location-1
            Response:
            "location successfuly deleted"


        b)Faculty : 
            i) Add a Faculty
            Functionality: Adds a new Faculty
            Route: /hr/addFaculty
            Request type: POST
            RequestBody: 
            {
              "displayName":"Engineering"
            }
            Response: Info of Faculty as added to DB (_name is needed later for updating a Faculty)
                {
                    "message": "Added Successfully",
                    "data": {
                        "departments": [],
                        "_id": "5fe5278ed84a0a3b91f945bd",
                        "name": "faculty-1",
                        "displayName": "Engineering",
                        "__v": 0
                            }
                }


            ii) update a Faculty
            Functionality: Updated the Faculty Name
            Route: /hr/editFaculty
            Request type: PUT
            RequestBody: 
                {
                    "name": "faculty-3",
                    "displayName": "LawUp"
                }
            Response: 
               {
                    "message": "edited Successfully",
                    "data": {
                        "departments": [],
                        "_id": "5fe52882bbaf5c3baf7a9ab9",
                        "name": "faculty-3",
                        "displayName": "LawUp",
                        "__v": 0
                    }
               }

            iii) Delete a Faculty
            Functionality: Deletes a Faculty & its corresponding: academicMember record (Not the profile of the member just the record that he/she belonged to this faculty), courses, departments
            Route: /hr/deleteFaculty/:name
            Request type: DELETE
             Params: /hr/deleteFaculty/faculty-2
            Response: Faculty successfuly deleted

        c)Department:
        i) Add a Department
            Functionality: Adds a new Department & adds it to its corresponsing department if HOD is added will create an academic member for him/her with their corresponding faculty & department
            Route: /hr/addDepartment
            Request type: POST
            RequestBody: 
            {
               "faculty":"faculty-1",
               "department":"Media"
            }
            Response:
            {
            "message": "Added Successfully",
                "data": {
                    "courses": [],
                    "_id": "5fe53b241dc6bd3dd50fcd11",
                    "name": "department-2",
                    "displayName": "Media",
                    "faculty": "faculty-1",
                    "__v": 0
                        }
            }   
            *Note: faculty & department are required

            ii) update a Department
            Functionality: can update the Department HOD and/or Faculty 
            Route: /hr/editDepartment
            Request type: PUT
            RequestBody: 
            {
                "department":"department-2",
                "displayName":"Arts",
                "faculty": "faculty-3"
            }
            Response: updated Successfully
            *Note: Faculty & department are required (if no updates are going to happen for the faculty, place its current faculty name)

            iii) Delete a Department
             Functionality: Deletes a Department & its corresponding: academicMember record (Not the profile of the member just the record that he/she belonged to this faculty),and its courses courses and removes it from its coresponding faculty
            Route: /hr/deleteDepartment/:faculty/:department
            Request type: DELETE
             Params: /hr/deleteDepartment/faculty-2/department-3
            Response: Department successfuly deleted
            *Note: faculty & department are a must
        d)Course:
        i) Add a Course
            Functionality: Adds a new Course & adds it to its corresponsing department
            Route: /hr/addCourse
            Request type: POST
            RequestBody: 
           {
                "department":"department-2",
                "course":"NOWCourFinal",
                "teachingSlots":2
            }
            Response:{
                "instructors": [],
                "TAs": [],
                "_id": "5fe63834b6ab625f43c07c3d",
                "name": "course-19",
                "displayName": "NOWCourFinal",
                "department": "department-2",
                "faculty": "faculty-3",
                "teachingSlots": 2,
                "__v": 0
            }
            *Note: course & department are required, Please use the "name" output to use it to refer to the course later

            ii) update a Course
            Functionality: can update the Department of the course (which will automatically update its corresponding faculty too) and its display name 
            Route: /hr/editCourse
            Request type: PUT
            RequestBody: {
               "department":"department-1",
                "course":"course-6",
                "displayName":"networksup"

            }
            Response: success
            *Note: "course" is required

            iii) Delete a Course
            Functionality: Deletes a course & its corresponding: academicMember record (Not the profile of the member just the record that he/she belonged to this course), and its record in the department's courses list
            Route: /hr/deleteCourse/:course
            Request type: DELETE
            Params:
            /hr/deleteCourse/course-5
            Response: 
            "Deleted successfully"
            
        e)add Staff Member
            Functionality: adds a new staff member
            Route: /hr/addStaffMember
            Request type: POST
            RequestBody:
            {
                "name":"HOD#1",
                "type":"HOD",
                "email":"HOD@guc.edu.eg",
                "officeLocation":"location-2",
                "department":"department-2",
                "salary":10000,
                "gender":"female",
                "dayOff":"Thursday"
            }
            Response:
            "Successfully added"

        f)Staff Member
           i) update a staff member
              Functionality: can update dayOff,email,name,officeLocation & mobileNumber of the staff member, if it updates a location it decerements the current capacity of the old location and increments the new one (note: capacity is the number of staff in this room)
            Route: /hr/updateStaff
            Request type: PUT
              RequestBody:{
                "id":"as-2",
                "officeLocation":"location-3",
                "email":"CIup@guc.edu.eg",
                "dayOff":"Monday",
                "name":"CI-Updated",
                "mobileNumber":"01111"
            }
            Response:{
                "dayOff": "Monday",
                "dayOffNumber": 1,
                "firstLogin": false,
                "annualLeaves": 0,
                "_id": "5fe55063dcba28369003fff8",
                "password": "$2a$10$NtoH59lN5Kv0pJCOtpNTsuRcIbxdSLauI.WASMHe9eMFq26FUWdS6",
                "id": "as-2",
                "name": "CI-Updated",
                "email": "CIup@guc.edu.eg",
                "salary": 10000,
                "officeLocation": "location-3",
                "gender": "male",
                "type": "CI",
                "__v": 0,
                "mobileNumber": "01111"
            }

            iii) Delete a staff member
            Functionality: Functionality: Deletes staff member, its coressponding record in academic members (where we store his/her department & course & faculty), and its record as a ta/instructor/ coordinator in its corresponding course
            Route: /hr/deleteStaff/:id
            Request type: DELETE
            Params:/hr/deleteStaff/as-6
            Response: successfully deleted
            *Note: if the deleted staff is HOD it sets its department HOD field to null
            
        g)Signin/Signout
            i) add sign in
            Functionality: adds a missing sign in
            Route: /hr/signIn
            Request type: POST
            RequestBody:
            {
                "date":"2021-01-25T07:00:00.000Z",
                "id":"as-2"
            }
            Response: return the attendance records with the time added to sign in array
            {
                "signIn": [
                    "2021-01-25T07:00:00.000Z"
                ],
                "signOut": [],
                "_id": "5fe5711e90c1733750f14a49",
                "id": "as-2",
                "date": "1/25/2021",
                "__v": 0
            }

            ii) add sign out
            Functionality: adds a missing sign out
            Route: /hr/signOut
            Request type: POST
            RequestBody:
            {
                "date":"2021-01-25T11:00:00.000Z",
                "id":"as-2"
            }
            Response: return the attendance records with the time added to sign out array
            {
                "signIn": [
                    "2021-01-25T07:00:00.000Z"
                ],
                "signOut": [
                    "2021-01-25T11:00:00.000Z"
                ],
                "_id": "5fe5711e90c1733750f14a49",
                "id": "as-2",
                "date": "1/25/2021",
                "__v": 0
            }

        h) attendance record
            Functionality: adds any staff member attendance record
            Route: /hr/viewAttendance/:id/:yearToView/:monthToView
            Request type: GET
            Parameters: 
            monthToView is the month you want to view its attendance and yearToView is the year the month is in and id is the id of the staff member that I want to view his/her attendance record
            Example of how to call route: 
            /hr/viewAttendance/hr-1/2020/12
            Response: array of attendance record each like the following
            {
                "signIn": [
                    "2020-12-23T09:00:47.740Z",
                    "2020-12-23T15:00:23.513Z"
                ],
                "signOut": [
                    "2020-12-23T14:00:08.009Z",
                    "2020-12-23T16:00:42.443Z"
                ],
                "_id": "5fe5233f599f5d9db8cae6f0",
                "id": "hr-1",
                "date": "12/24/2020",
                "__v": 0
            }

        i) missing hours/days
            i) view missing hours
            Functionality: view staff members with missing hours
            Route: /hr/missingHours/:yearToView/:monthToView
            Request type: GET
            Parameters: 
            monthToView is the month you want to view its missing hours and yearToView is the year the month is in
            Example of how to call route: 
            hr/missingHours/2020/12
            Response:array with all staff members with missing hours each like the following
            {
                "dayOff": "Saturday",
                "dayOffNumber": 6,
                "firstLogin": false,
                "annualLeaves": 0,
                "_id": "5fe5106f88ffe53449235269",
                "name": "HR#1",
                "email": "HR1@guc.edu.eg",
                "id": "hr-1",
                "gender": "female",
                "salary": 20000,
                "password": "$2a$10$9z8gYrEar.Z.iX6Xh2KfLuzv8u.iml08tFIXzDQNkQZjJKCKSX/zG",
                "officeLocation": null,
                "type": "HR",
                "mobileNumber": "5555",
                "__v": 0
           }

            ii) view missing days
            Functionality: view staff members with missing days
            Route: /hr/missingDays/:yearToView/:monthToView
            Request type: GET
            Parameters: 
            monthToView is the month you want to view its missing days and yearToView is the year the month is in
            Example of how to call route: 
            /hr/missingDays/2020/12
            Response:array with all staff members with missing days each like the following
            {
                "dayOff": "Saturday",
                "dayOffNumber": 6,
                "firstLogin": false,
                "annualLeaves": 0,
                "_id": "5fe5106f88ffe53449235269",
                "name": "HR#1",
                "email": "HR1@guc.edu.eg",
                "id": "hr-1",
                "gender": "female",
                "salary": 20000,
                "password": "$2a$10$9z8gYrEar.Z.iX6Xh2KfLuzv8u.iml08tFIXzDQNkQZjJKCKSX/zG",
                "officeLocation": null,
                "type": "HR",
                "mobileNumber": "5555",
                "__v": 0
             }

        j)update Salary
            Functionality: updates the salary of a staff member
            Route: /hr/updateSalary
            Request type: PUT
            RequestBody:
            {
                "id":"as-1",
                "salary":"20"
            }
            Response:
            {
                "dayOff": "Thursday",
                "dayOffNumber": 4,
                "firstLogin": true,
                "annualLeaves": 0,
                "_id": "5fe54ceb13c3b230046ec4a2",
                "password": "$2a$10$BZafe3Gxu8nP0D6mJgphne7Azu3/8xrZtPlhvqCsZFKtj3bPbpiVu",
                "id": "as-1",
                "name": "HOD#1",
                "email": "HOD@guc.edu.eg",
                "salary": 20,
                "officeLocation": "location-2",
                "gender": "female",
                "type": "HOD",
                "__v": 0
           }



    4)Academic member functionalities:

        4.1)HOD Functionalities:

            a)Assign/delete/update a course instructor for each course in his department
                i)Add course instructor
                    Functionality: add course instructor to course
                    Route: /hod/addInstructor
                    Request type: POST
                    RequestBody:
                    {
                        "course":"course-1",
                        "instructor":"as-2"
                    }
                    Response: course with course id of instructor added in instructors
                   {
                        "instructors": [
                            "as-2"
                        ],
                        "TAs": [],
                        "_id": "5fe542e0dfdf8b3eb7fd30ca",
                        "name": "course-1",
                        "displayName": "Drawing",
                        "department": "department-2",
                        "faculty": "faculty-3",
                        "__v": 0
                  }
                    *Note:
                    Request Header: KEY:Authorization & VALUE: access token from login repsonse
                    Request Header Params: includes payload object which is provided at token verification and has id,type & email of logged in staff member

                ii)update course instructor
                    Functionality: updates course instructor by taking as an input the course instructor and assigning him/her to a another course (the system removes him/her from the old course and adds him/her to the new course instantly)
                    Route: /hod/updateInstructor
                    Request type: POST
                    RequestBody:{
                        "instructor":"as-1",
                        "course":"course-1"

                        }
                    Response:
                    Updated succesfully  
                    *Note:
                    "course" represents the new course to get assigned to
                    Request Header: KEY:Authorization & VALUE: access token from login repsonse
                    Request Header Params: includes payload object which is provided at token verification and has id,type & email of logged in staff member

                iii)delete course instructor
                        Functionality: delete course instructor from list of course
                        Route: /hod/deleteinstructor/:course/:instructor
                        Request type: DELETE
                        Parameters: course is course id i want to delete from and instructor is instructor id i want to delete
                        Example of how to call route: /hod/deleteInstructor/c1/15
                        Response:
                        {
                            "instructors": [],
                            "TAs": [],
                            "_id": "5fe542e0dfdf8b3eb7fd30ca",
                            "name": "course-1",
                            "displayName": "Drawing",
                            "department": "department-2",
                            "faculty": "faculty-3",
                            "__v": 0
                        }
                        *Note:
                        Request Header: KEY:Authorization & VALUE: access token from login repsonse
                        Request Header Params: includes payload object which is provided at token verification and has id,type & email of logged in staff member


            b)view Staff
            i) view staff 
               Functionality: view Staff in his/her department
                        Route: /hod/viewStaff
                        Request type: GET
                        Response: returns an array of user profiles that are in my department each like the following
                        {
                            "dayOff": "Saturday",
                            "dayOffNumber": 6,
                            "firstLogin": true,
                            "annualLeaves": 0,
                            "_id": "5fe55063dcba28369003fff8",
                            "password": "$2a$10$NtoH59lN5Kv0pJCOtpNTsuRcIbxdSLauI.WASMHe9eMFq26FUWdS6",
                            "id": "as-2",
                            "name": "CI#1",
                            "email": "CI@guc.edu.eg",
                            "salary": 10000,
                            "officeLocation": "location-2",
                            "gender": "male",
                            "type": "CI",
                            "__v": 0
                        }

                ii) view staff using course
                        Functionality: view Staff in his/her department
                        Route: /hod/viewStaff/:course
                        Request type: GET
                        Parameters:
                        courseId is the course I want to view the academic members in
                        Example of how to call route:
                        hod/viewStaff/course-1
                        Response:returns an array of user profiles that are in the course specified in my department 
                        {
                            "dayOff": "Saturday",
                            "dayOffNumber": 6,
                            "firstLogin": true,
                            "annualLeaves": 0,
                            "_id": "5fe55063dcba28369003fff8",
                            "password": "$2a$10$NtoH59lN5Kv0pJCOtpNTsuRcIbxdSLauI.WASMHe9eMFq26FUWdS6",
                            "id": "as-2",
                            "name": "CI#1",
                            "email": "CI@guc.edu.eg",
                            "salary": 10000,
                            "officeLocation": "location-2",
                            "gender": "male",
                            "type": "CI",
                            "__v": 0
                         }

            c)view Dayoff
            i)view day off all staff
            Functionality: view the day off of the staff
                        Route: /hod/viewdayoff
                        Request type: GET
                        Response:
                        {
                            "as-2": "Saturday",
                            "as-1": "Thursday"
                        }
            ii)view day off single staff
            Functionality: view the day off of the staff
                        Route: /hod/viewdayoff/:staffId
                        Request type: GET
                        Parameters:
                        staffId is the id of the academic member in my department that I want to view his/her day off
                        Example of how to call route:
                        /hod/viewdayoff/as-2
                        Response:
                        {
                          "as-2": "Saturday"
                        }         

            d)View all requets changeDayOff/Leave
                Functionality: 
                Route: /hod/viewrequests
                Request type: GET
                Response: returns all change day off/leave requests sent by staff in his department 
                {
                        "status": "Pending",
                        "_id": "5fe60c6891b78a2e30e61d6e",
                        "fromId": "as-6",
                        "toId": "as-1",
                        "type": "changeDayOff",
                        "reason": "reason",
                        "date": "2020-12-24T22:00:00.599Z",
                        "dayToChange": 2,
                        "__v": 0
                }               
                *Note:
                Request Header: KEY:Authorization & VALUE: access token from login repsonse
                Request Header Params: includes payload object which is provided at token verification and has id,type & email of logged in staff member
            
            e)Accept request
                Functionality: accept request
                Route: /hod/acceptRequest
                Request type: POST
                Request body:
                {
                    "id":"5fe60c6891b78a2e30e61d6e"
                }
                Response: returns request with status changed to accepted and day off is changed in staffMembers schema
                {
                    "status": "Accepted",
                    "_id": "5fe60c6891b78a2e30e61d6e",
                    "fromId": "as-6",
                    "toId": "as-1",
                    "type": "changeDayOff",
                    "reason": "reason",
                    "date": "2020-12-24T22:00:00.599Z",
                    "dayToChange": 2,
                    "__v": 0
                }             
                *Note:
                Request Header: KEY:Authorization & VALUE: access token from login repsonse
                Request Header Params: includes payload object which is provided at token verification and has id,type & email of logged in staff member

           f)Reject request
                Functionality: accept request
                Route: /hod/rejectRequest
                Request type: POST
                Request body:
                {
                    "id":"5fe60c6891b78a2e30e61d6e",
                    "reason":"reason"
                }
                Response: returns request with status changed to rejected with optional reason 
                {
                    "status": "Rejected",
                    "_id": "5fe60c6891b78a2e30e61d6e",
                    "fromId": "as-6",
                    "toId": "as-1",
                    "type": "changeDayOff",
                    "reason": "reason",
                    "date": "2020-12-24T22:00:00.599Z",
                    "dayToChange": 2,
                    "__v": 0,
                    "rejectionReason": "reason"
                }           
                *Note:
                Request Header: KEY:Authorization & VALUE: access token from login repsonse
                Request Header Params: includes payload object which is provided at token verification and has id,type & email of logged in staff member
            
            g) view coverage
            Functionality: view the coverage of each course
                        Route: /hod/viewCoverage
                        Request type: GET
                        Response:{
                        "course-3": 0,
                        "course-2": 25
                    }
                    Note: number is output in percentage,
                     no input is needed as the id of the currently logged in HOD is saved in the payload

            h) view assignments
             Functionality: view teaching assignments of course offered by his department
                        Route: /hod/viewassignment/:course'
                        Request type: GET 
                        Params:/viewassignment/course-2
                        Response:
                        [
                            {
                                "_id": "5fe5cc98ce7883399c82d443",
                                "id": 2,
                                "course": "course-2",
                                "slot": "4",
                                "day": "Monday",
                                "instructor": "as-3",
                                "location": "location-3",
                                "__v": 0
                            }
                        ]
                *Note:
                Request Header: KEY:Authorization & VALUE: access token from login repsonse
                Request Header Params: includes payload object which is provided at token verification and has id,type & email of logged in staff member

        4.2)Course Instructor Functionalities

            a)view coverage
            Functionality: view coverage of course he/she is assigned to
                Route: /ci/viewCoverage
                Request type: GET
                Response:{
                    "course-2": 25
                }
                 *Note:
                Request Header: KEY:Authorization & VALUE: access token from login repsonse
                Request Header Params: includes payload object which is provided at token verification and has id,type & email of logged in staff member

            b)view slot's assignment
             Functionality: view slot's assignment of course he/she is assigned to
                Route: /ci/viewSlotsAssignment
                Request type: GET
                RequestBody:
                Response:
                {
                    "course-2": [
                        {
                            "_id": "5fe5cc98ce7883399c82d443",
                            "id": 2,
                            "course": "course-2",
                            "slot": "4",
                            "day": "Monday",
                            "instructor": "as-2",
                            "location": "location-3",
                            "__v": 0
                        }
                    ]
                }
                  *Note:
                Request Header: KEY:Authorization & VALUE: access token from login repsonse
                Request Header Params: includes payload object which is provided at token verification and has id,type & email of logged in staff member

            c)
            i)view all staff in his department
             Functionality: view all staff in his/her department along with their profiles
                Route: /ci/viewStaff
                Request type: GET
                Response:{
    "department-1": {
                "0": {
                    "dayOff": "Wednesday",
                    "dayOffNumber": 3,
                    "firstLogin": false,
                    "annualLeaves": 0,
                    "_id": "5fe57579e965c51c882f79bb",
                    "password": "$2a$10$5C.dLv13sDbshTblD/xLNeSp5z9bNxneqUL3lzkt9leb/4MwvkThm",
                    "id": "as-3",
                    "name": "TA#1",
                    "email": "TA@guc.edu.eg",
                    "salary": 2000,
                    "officeLocation": "location-2",
                    "gender": "male",
                    "type": "TA",
                    "__v": 0
                },
                "1": {
                    "dayOff": "Wednesday",
                    "dayOffNumber": 3,
                    "firstLogin": false,
                    "annualLeaves": 0,
                    "_id": "5fe5d0ad7bbdbe224791a526",
                    "password": "$2a$10$5C.dLv13sDbshTblD/xLNeSp5z9bNxneqUL3lzkt9leb/4MwvkThm",
                    "id": "as-6",
                    "name": "TA#1",
                    "email": "TAkh@guc.edu.eg",
                    "salary": 2000,
                    "officeLocation": "location-2",
                    "gender": "male",
                    "type": "TA",
                    "__v": 0
                },
                
            }

               ii)view all staff per course in his department
             Functionality: view all staff in his/her department in a specific course along with their profiles
                Route: /ci/viewStaff/:course
                Request type: GET
                Params: /ci/viewStaff/course-5
                Response:{
                    "course-5": {
                        "0": {
                            "dayOff": "Saturday",
                            "dayOffNumber": 2,
                            "firstLogin": false,
                            "annualLeaves": 0,
                            "_id": "5fe5ca45ea87e768f3bd04ee",
                            "firstlogin": false,
                            "name": "CC1",
                            "email": "CC1@guc.edu.eg",
                            "id": "as-7",
                            "gender": "male",
                            "salary": 20000,
                            "password": "$2a$10$9z8gYrEar.Z.iX6Xh2KfLuzv8u.iml08tFIXzDQNkQZjJKCKSX/zG",
                            "officeLocation": null,
                            "type": "CC",
                            "mobileNumber": "013435"
                        }
                    }
                }
d)Assign an academic member to an unassigned slot
                Functionality: assign academic member to slot
                Route: /ci/assignSlot
                Request type: POST
                RequestBody:
    	        {
    		"staffId":"as-3",
    		"courseName":"course-1",
    		"slotId":2
		}
                Response: updated slot with instructor assigned to it
                {
    		"_id": "5fe5cc98ce7883399c82d443",
   		 "id": 2,
   		 "course": "course-1",
    		"slot": "4",
    		"day": "Monday",
    		"instructor": "as-3",
    		"location": "location-3",
    		"__v": 0
		}
                *Note:
                Request Header: KEY:Authorization & VALUE: access token from login repsonse
                Request Header Params: includes payload object which is provided at token verification and has id,type & email of logged in staff member

e)Update/delete assignment of academic member
                i)Update
                    Functionality: update assignment of an academic member from one slot to another
                    Route: /ci/updateSlot
                    Request type: POST
                    RequestBody:
                   {
		    	"staffId":"as-3",
    			"courseName":"course-1",
   			"oldSlotId":2,
    			"newSlotId":1
		   }
                    Response: updated slot with instructor assigned to it
                    {
    			"_id": "5fe610b9ea87e768f3bd04f1",
   			 "id": 1,
   			 "course": "course-1",
  			  "slot": "1",
  			  "day": "Wednesday",
   			 "instructor": "as-3",
   			 "location": "location-3"
		    }
                    *Note:
                    Request Header: KEY:Authorization & VALUE: access token from login repsonse
                    Request Header Params: includes payload object which is provided at token verification and has id,type & email of logged in staff member

		ii)Delete
                    Functionality: delete assignment of an academic member from one slot to another
                    Route: ci/deleteSlot/:course/:staffId/:oldSlotId
                    Request type: DELETE
                    Parameters: course is name of course I want to remove assignment from, staff Id is the academic member that I want to delete his/her assignment, oldSlotId is the slot id of the slot that I want to remove the academic member from
                    Example of how to call route: ci/deleteSlot/course-1/as-3/1
                    Response: slot with instructor set to null indicating assignment is deleted 
                    {
    			"_id": "5fe610b9ea87e768f3bd04f1",
  			  "id": 1,
   			 "course": "course-1",
   			 "slot": "1",
   			 "day": "Wednesday",
 			   "instructor": null,
   			 "location": "location-3"
			}
                    *Note:
                    Request Header: KEY:Authorization & VALUE: access token from login repsonse
                    Request Header Params: includes payload object which is provided at token verification and has id,type & email of logged in staff member

	f)Remove an assigned academic from course
                Functionality: remove academic member completely from course
                    Route: /removeFromCourse/:course/:staffId
                    Request type: DELETE
                    Parameters: course is name of course I want to remove assignment from, staff Id is the academic member that I want to remove from course
                    Example of how to call route: ci/removeFromCourse/course-1/as-3
                    Response: 
                    Successfully removed
                    *Note:
                    Request Header: KEY:Authorization & VALUE: access token from login repsonse
                    Request Header Params: includes payload object which is provided at token verification and has id,type & email of logged in staff member

	g)Assign an academic member to be course coordinator
                Functionality: assign a academic member as course coordinator in a course
                Route: /ci/assignCourseCordinator
                Request type: POST
                RequestBody:
		{
    		"courseId":"course-1",
  		  "id":"as-3"
		}
                Response: updated slot with coordinator assigned to it
                {
   		 "instructors": [
     		   "as-2"
				],
  		  "TAs": [
        		"as-1",
      			 "as-3"
 			 ],
 		   "_id": "5fe548807bba283f164f3da7",
   		 "name": "course-1",
   		 "displayName": "NewCourse",
    		"department": "department-1",
  		"faculty": "faculty-1",
   		 "__v": 0,
    		"coordinator": "as-3"
		}
                    *Note:
                    Request Header: KEY:Authorization & VALUE: access token from login repsonse
                    Request Header Params: includes payload object which is provided at token verification and has id,type & email of logged in staff member

             h)TA:
         
             i)addTa
                Functionality: add TA to a course
                Route: /ci/addTA
                Request type: POST
                RequestBody:
                {
                    "ta":"as-3",
                    "course":"course-1"
                }
                Response: 
                {
                    "instructors": [],
                    "TAs": [
                        "as-3"
                    ],
                    "_id": "5fe542e0dfdf8b3eb7fd30ca",
                    "name": "course-1",
                    "displayName": "Drawing",
                    "department": "department-2",
                    "faculty": "faculty-3",
                    "__v": 0
                }
            ii)DeleteTa
            Functionality: remove TA from course
                    Route: /ci/deleteTA/:course/:ta
                    Request type: DELETE
                    Parameters: course is name of course I want to remove from, the TA is the TA i want to remove
                    Example of how to call route: 
                    /ci/deleteTA/course-1/as-3
                    Response: course with TA removed from it
                    {
                        "instructors": [],
                        "TAs": [],
                        "_id": "5fe542e0dfdf8b3eb7fd30ca",
                        "name": "course-1",
                        "displayName": "Drawing",
                        "department": "department-2",
                        "faculty": "faculty-3",
                        "__v": 0
                    }
                    *Note:
                    Request Header: KEY:Authorization & VALUE: access token from login repsonse
                    Request Header Params: includes payload object which is provided at token verification and has id,type & email of logged in staff member


        4.3)Course Coordinator Functionalities

            a)View slot linking requests
                Functionality: view slot linking requests from academic members linked to his/her course
                Route: /coordinator/slotRequests
                Request type: GET
                Response:[
                        {
                            "status": "Accepted",
                            "_id": "5fe61a9e7bbdbe224791a549",
                            "fromId": "as-7",
                            "toId": "as-10",
                            "type": "slotLinking",
                            "course": "course-2",
                            "replacementDate": "2020-12-27T22:00:00.000Z",
                            "date": "2020-12-24T22:00:00.373Z",
                            "slotId": 2,
                            "__v": 0
                        }
                    ]
                     *Note:
                    Request Header: KEY:Authorization & VALUE: access token from login repsonse
                    Request Header Params: includes payload object which is provided at token verification and has id,type & email of logged in staff member

            b)Accept/reject requests
                Functionality: accept/reject slot linking requests from academic members linked to his course
                Route: /coordinator/replyRequest
                Request type: POST
                Body:{
                "slotId":"2",
                "fromId":"as-7",
                "status":"Accepted"
                }
                Response: Succesffuly linked

            c)Add/delete/update course slot 
                i)Add course slot
                    Functionality: create a course slot in his/her course
                    Route: /coordinator/addSlot
                    Request type: POST
                    RequestBody:{
                    "course":"course-4",
                    "slot":"5",
                    "day":"Thursday",
                    "location":"location-2",
                     "instructor":"as-2"
                    }
                    Response: Succesfully created
                    

                ii)update course slot
                    Functionality: update course slot in his/her course
                    Route: /coordinator/editSlot
                    Request type: PUT
                    RequestBody:
                        {
                        "id":"3", 
                        "course":"course-2",
                        "slot":"4",
                        "day":"Monday",
                        "location":"location-2",
                        "instructor":"as-1"
                        }
                    Response: success

                

                iii)delete course slot
                        Functionality: deletes a slot in his/her course
                        Route: /coordinator/deleteSlot/:id
                        Request type: DELETE
                        Parameters: /coordinator/deleteSlot/3
                        Response: Slot successfuly deleted
                      

  4.4)Academic Member Functionalities 

            a)View their own including all teaching activities and replacements
                Functionality: view schedule
                Route: /academicMember/schedule
                Request type: GET
                Response: array of assigned schedule slots and array of upcoming replacement slots
                {
                    "slots": [
                        {
                            "_id": "5fe5cc98ce7883399c82d443",
                            "id": 2,
                            "course": "course-2",
                            "slot": "4",
                            "day": "Monday",
                            "instructor": "as-6",
                            "location": "location-3",
                            "__v": 0
                        }
                    ],
                    "replacements": [
                        {
                            "status": "Accepted",
                            "_id": "5fe5fd4da77a352738adcce8",
                            "fromId": "CC-1",
                            "toId": "as-6",
                            "type": "replacement",
                            "course": "course-2",
                            "replacementDate": "2020-12-27T22:00:00.000Z",
                            "date": "2020-12-24T22:00:00.373Z",
                            "slotId": 2,
                            "__v": 0
                        }
                    ]
                }              
                *Note:
                Request Header: KEY:Authorization & VALUE: access token from login repsonse
                Request Header Params: includes payload object which is provided at token verification and has id,type & email of logged in staff member                

            b)Send and view replacement requests
                i)Send replacement request
                    Functionality: send replacement request
                    Route: /academicMember/sendReplacementRequest
                    Request type: POST
                    RequestBody:
                    {
                        "id":"as-6",
                        "course":"course-2",
                        "slot":2,
                        "date":"12/27/2020"
                    }                   
                    Response: returns creates request with status as pending
                    {
                        "status": "Pending",
                        "_id": "5fe5fd4da77a352738adcce8",
                        "fromId": "CC-1",
                        "toId": "as-6",
                        "type": "replacement",
                        "course": "course-2",
                        "replacementDate": "2020-12-26T22:00:00.000Z",
                        "date": "2020-12-24T22:00:00.373Z",
                        "slotId": 2,
                        "__v": 0
                    }                  
                    *Note:
                    Request Header: KEY:Authorization & VALUE: access token from login repsonse
                    Request Header Params: includes payload object which is provided at token verification and has id,type & email of logged in staff member 

                ii)View replacement requests 
                    Functionality: view replacement requests sent to me
                    Route: /academicMember/viewReplacementRequests
                    Request type: GET
                    Response: array of replacement requests sent to me each like the following
                    {
                        "status": "Pending",
                        "_id": "5fe5fd4da77a352738adcce8",
                        "fromId": "CC-1",
                        "toId": "as-6",
                        "type": "replacement",
                        "course": "course-2",
                        "replacementDate": "2020-12-26T22:00:00.000Z",
                        "date": "2020-12-24T22:00:00.373Z",
                        "slotId": 2,
                        "__v": 0
                    }
                    *Note:
                    Request Header: KEY:Authorization & VALUE: access token from login repsonse
                    Request Header Params: includes payload object which is provided at token verification and has id,type & email of logged in staff member  

                iii)Reply replacement requests  
                    Functionality: accept/reject replacement requests sent to me
                    Route: /academicMember/viewReplacementRequests
                    Request type: POST
                    Request Body:
                    {
                        "id":"5fe5fd4da77a352738adcce8",
                        "status":"Accepted"
                    }
                    Response: array of replacement requests sent to me each like the following
                    {
                        "status": "Accepted",
                        "_id": "5fe5fd4da77a352738adcce8",
                        "fromId": "CC-1",
                        "toId": "as-6",
                        "type": "replacement",
                        "course": "course-2",
                        "replacementDate": "2020-12-26T22:00:00.000Z",
                        "date": "2020-12-24T22:00:00.373Z",
                        "slotId": 2,
                        "__v": 0
                    }
                    *Note:
                    Request Header: KEY:Authorization & VALUE: access token from login repsonse
                    Request Header Params: includes payload object which is provided at token verification and has id,type & email of logged in staff member                        

            c)Send slot linking request
                Functionality: send slot linking request to course coordinator
                Route: /academicMember/sendSlotLinkingRequest
                Request type: POST
                RequestBody:
                {
                    "course":"course-2",
                    "slot":2
                }
                Response: returns created slot linking request
                {
                    "status": "Pending",
                    "_id": "5fe608469075f718e03442bc",
                    "fromId": "as-6",
                    "toId": "as-7",
                    "type": "slotLinking",
                    "slotId": 2,
                    "course": "course-2",
                    "date": "2020-12-24T22:00:00.115Z",
                    "__v": 0
                }
                *Note:
                Request Header: KEY:Authorization & VALUE: access token from login repsonse
                Request Header Params: includes payload object which is provided at token verification and has id,type & email of logged in staff member

            d)Send change day off request
                Functionality: send change day off request to HOD
                Route: /academicMember/sendChangeDayOffRequest
                Request type: POST
                RequestBody: reason is optional can also send an empty body
                {
                    "reason":"reason",
                    "day":"Tuesday"
                }
                Response: returns created change day off request
                {
                    "status": "Pending",
                    "_id": "5fe60c6891b78a2e30e61d6e",
                    "fromId": "as-6",
                    "toId": "as-1",
                    "type": "changeDayOff",
                    "reason": "reason",
                    "date": "2020-12-24T22:00:00.599Z",
                    "dayToChange": 2,
                    "__v": 0
                }
                *Note:
                Request Header: KEY:Authorization & VALUE: access token from login repsonse
                Request Header Params: includes payload object which is provided at token verification and has id,type & email of logged in staff member
            
            e)Submit leave request
                Functionality: send leave request to HOD
                Route: /academicMember/sendLeaveRequest
                Request type: POST
                RequestBody: reason is optional can also send an empty body
                {
                    "leave":"Sick",
                    "startDate":"12/26/2020",
                    "endDate":"12/29/2020",
                    "documents":"documents"
                }
                Response: returns created leave request
                {
                    "status": "Pending",
                    "_id": "5fe63b6a78378c1d10763339",
                    "fromId": "as-6",
                    "toId": "as-1",
                    "type": "leave",
                    "leaveType": "Sick",
                    "date": "2020-12-24T22:00:00.485Z",
                    "leaveStartDate": "2020-12-25T22:00:00.000Z",
                    "leaveEndDate": "2020-12-28T22:00:00.000Z",
                    "documents": "documents",
                    "__v": 0
                }
                *Note:
                Request Header: KEY:Authorization & VALUE: access token from login repsonse
                Request Header Params: includes payload object which is provided at token verification and has id,type & email of logged in staff member
          

            f)Get notified when requests are accepted/rejected
                Functionality: view notifications indicating acceptance/rejection of requests
                Route: /academicMember/notifications
                Request type: GET
                Response: returns array of notifications showing id of requests each like the following
                {
                        "_id": "5fe60046ade6ea043824582d",
                        "requestID": "5fe5fd4da77a352738adcce8",
                        "to": "as-7",
                        "__v": 0
                }
                *Note:
                Request Header: KEY:Authorization & VALUE: access token from login repsonse
                Request Header Params: includes payload object which is provided at token verification and has id,type & email of logged in staff member  
            
            g)View submitted requests
                i)View all submitted requests
                    Functionality: get all requests that I previously sent
                    Route: /academicMember/viewRequests
                    Request type: GET
                    Response: array of requests each of the following format
                    {
                        "status": "Accepted",
                        "_id": "5fe5fd4da77a352738adcce8",
                        "fromId": "as-7",
                        "toId": "as-6",
                        "type": "replacement",
                        "course": "course-2",
                        "replacementDate": "2020-12-27T22:00:00.000Z",
                        "date": "2020-12-24T22:00:00.373Z",
                        "slotId": 2,
                        "__v": 0
                    }
                    *Note:
                    Request Header: KEY:Authorization & VALUE: access token from login repsonse
                    Request Header Params: includes payload object which is provided at token verification and has id,type & email of logged in staff member

                ii)View submitted requests with specific status 
                    Functionality: get all Accepted/Pending/Rejected requests sent by me
                    Route: /academicMember/viewRequests/:status
                    Request type: GET
                    Parameters: status is Accepted/Pending/Rejected based on request status criteria I want to view
                    Example of how to call route: /academicMember/viewRequests/Accepted
                    Response: array of requests sent by me with provided status in parameters each of the following format
                    {
                        "status": "Accepted",
                        "_id": "5fe5fd4da77a352738adcce8",
                        "fromId": "as-7",
                        "toId": "as-6",
                        "type": "replacement",
                        "course": "course-2",
                        "replacementDate": "2020-12-27T22:00:00.000Z",
                        "date": "2020-12-24T22:00:00.373Z",
                        "slotId": 2,
                        "__v": 0
                    }
                    *Note:
                    Request Header: KEY:Authorization & VALUE: access token from login repsonse
                    Request Header Params: includes payload object which is provided at token verification and has id,type & email of logged in staff member             

            h)Cancel a pending request or cancel a leave request whose day is yet to come
                Functionality: cancel request that is still being processed(pending) or cancel a leave request that i did not use yet
                Route: /academicMember/cancelRequest/:id
                Request type: DELETE
                Parameters: id is the mongodb id of the request I want to cancel
                Example of how to call route: /academicMember/cancelRequest/5fe608469075f718e03442bc
                Response: returns deleted request
                {
                    "status": "Pending",
                    "_id": "5fe608469075f718e03442bc",
                    "fromId": "as-6",
                    "toId": "as-7",
                    "type": "slotLinking",
                    "slotId": 2,
                    "course": "course-2",
                    "date": "2020-12-24T22:00:00.115Z",
                    "__v": 0
                }
                *Note:
                Request Header: KEY:Authorization & VALUE: access token from login repsonse
                Request Header Params: includes payload object which is provided at token verification and has id,type & email of logged in staff member





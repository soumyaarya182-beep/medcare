const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const User = require("../models/User");

const router = express.Router();


/*
=========================================================
MEDCARE - AUTHENTICATION ROUTES
=========================================================

BASE URL:

/api/auth


ROUTES:

POST    /api/auth/register
POST    /api/auth/login
GET     /api/auth/me
PUT     /api/auth/profile
PUT     /api/auth/change-password
POST    /api/auth/logout
DELETE  /api/auth/account


Authentication is handled using JWT.

=========================================================
*/


/*
=========================================================
HELPER: CREATE JWT
=========================================================
*/

const createToken = (user) => {

    return jwt.sign(

        {
            id: user._id.toString(),

            email: user.email

        },

        process.env.JWT_SECRET,

        {
            expiresIn:
                process.env.JWT_EXPIRES_IN ||
                "7d"
        }

    );

};


/*
=========================================================
HELPER: VALIDATE EMAIL
=========================================================
*/

const isValidEmail = (email) => {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(email);

};


/*
=========================================================
HELPER: VALIDATE PASSWORD
=========================================================
*/

const isStrongPassword = (password) => {

    /*
    Minimum:

    8 characters
    1 uppercase
    1 lowercase
    1 number

    */

    return (
        typeof password === "string" &&
        password.length >= 8 &&
        /[A-Z]/.test(password) &&
        /[a-z]/.test(password) &&
        /[0-9]/.test(password)
    );

};


/*
=========================================================
REGISTER
=========================================================

POST

/api/auth/register


REQUEST BODY:

{
    "name": "Soumya Arya",
    "email": "soumya@example.com",
    "password": "Password123",
    "phone": "9876543210"
}

=========================================================
*/

router.post(
    "/register",
    async (req, res) => {

        try {

            const {

                name,

                email,

                password,

                phone,

                dateOfBirth,

                gender

            } = req.body;


            /*
            ---------------------------------------------
            REQUIRED FIELD VALIDATION
            ---------------------------------------------
            */

            if (
                !name ||
                !email ||
                !password
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Name, email and password are required."

                });

            }


            /*
            ---------------------------------------------
            CLEAN INPUT
            ---------------------------------------------
            */

            const cleanName =
                name.trim();


            const cleanEmail =
                email
                    .trim()
                    .toLowerCase();


            /*
            ---------------------------------------------
            NAME VALIDATION
            ---------------------------------------------
            */

            if (
                cleanName.length < 2
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Name must contain at least 2 characters."

                });

            }


            if (
                cleanName.length > 100
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Name cannot exceed 100 characters."

                });

            }


            /*
            ---------------------------------------------
            EMAIL VALIDATION
            ---------------------------------------------
            */

            if (
                !isValidEmail(
                    cleanEmail
                )
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Please enter a valid email address."

                });

            }


            /*
            ---------------------------------------------
            PASSWORD VALIDATION
            ---------------------------------------------
            */

            if (
                !isStrongPassword(
                    password
                )
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Password must contain at least 8 characters, one uppercase letter, one lowercase letter and one number."

                });

            }


            /*
            ---------------------------------------------
            CHECK EXISTING USER
            ---------------------------------------------
            */

            const existingUser =
                await User.findOne({

                    email:
                        cleanEmail

                });


            if (
                existingUser
            ) {

                return res.status(409).json({

                    success: false,

                    message:
                        "An account with this email already exists."

                });

            }


            /*
            ---------------------------------------------
            HASH PASSWORD
            ---------------------------------------------
            */

            const salt =
                await bcrypt.genSalt(12);


            const hashedPassword =
                await bcrypt.hash(
                    password,
                    salt
                );


            /*
            ---------------------------------------------
            CREATE USER
            ---------------------------------------------
            */

            const user =
                new User({

                    name:
                        cleanName,

                    email:
                        cleanEmail,

                    password:
                        hashedPassword,

                    phone:
                        phone
                            ? phone.trim()
                            : "",

                    dateOfBirth:
                        dateOfBirth ||
                        null,

                    gender:
                        gender ||
                        "",

                    isActive:
                        true

                });


            /*
            ---------------------------------------------
            SAVE USER
            ---------------------------------------------
            */

            await user.save();


            /*
            ---------------------------------------------
            CREATE JWT
            ---------------------------------------------
            */

            const token =
                createToken(
                    user
                );


            /*
            ---------------------------------------------
            RESPONSE
            ---------------------------------------------
            */

            return res.status(201).json({

                success: true,

                message:
                    "Account created successfully.",

                token,

                user: {

                    id:
                        user._id,

                    name:
                        user.name,

                    email:
                        user.email,

                    phone:
                        user.phone,

                    role:
                        user.role,

                    dateOfBirth:
                        user.dateOfBirth,

                    gender:
                        user.gender

                }

            });

        }

        catch (error) {

            console.error(
                "REGISTER ERROR:",
                error
            );


            /*
            MONGODB DUPLICATE KEY
            */

            if (
                error.code === 11000
            ) {

                return res.status(409).json({

                    success: false,

                    message:
                        "An account with this email already exists."

                });

            }


            /*
            MONGOOSE VALIDATION ERROR
            */

            if (
                error.name ===
                "ValidationError"
            ) {

                const errors =
                    Object.values(
                        error.errors
                    ).map(
                        error =>
                            error.message
                    );


                return res.status(400).json({

                    success: false,

                    message:
                        "Registration validation failed.",

                    errors

                });

            }


            return res.status(500).json({

                success: false,

                message:
                    "Unable to create account."

            });

        }

    }
);


/*
=========================================================
LOGIN
=========================================================

POST

/api/auth/login


REQUEST BODY:

{
    "email": "soumya@example.com",
    "password": "Password123"
}

=========================================================
*/

router.post(
    "/login",
    async (req, res) => {

        try {

            const {

                email,

                password

            } = req.body;


            /*
            ---------------------------------------------
            CHECK INPUT
            ---------------------------------------------
            */

            if (
                !email ||
                !password
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Email and password are required."

                });

            }


            /*
            ---------------------------------------------
            NORMALIZE EMAIL
            ---------------------------------------------
            */

            const cleanEmail =
                email
                    .trim()
                    .toLowerCase();


            /*
            ---------------------------------------------
            FIND USER
            ---------------------------------------------
            */

            const user =
                await User.findOne({

                    email:
                        cleanEmail

                }).select(
                    "+password"
                );


            /*
            ---------------------------------------------
            DON'T REVEAL WHETHER EMAIL EXISTS
            ---------------------------------------------
            */

            if (
                !user
            ) {

                return res.status(401).json({

                    success: false,

                    message:
                        "Invalid email or password."

                });

            }


            /*
            ---------------------------------------------
            CHECK ACCOUNT STATUS
            ---------------------------------------------
            */

            if (
                user.isActive === false
            ) {

                return res.status(403).json({

                    success: false,

                    message:
                        "This account has been deactivated."

                });

            }


            /*
            ---------------------------------------------
            COMPARE PASSWORD
            ---------------------------------------------
            */

            const passwordMatches =
                await bcrypt.compare(

                    password,

                    user.password

                );


            if (
                !passwordMatches
            ) {

                return res.status(401).json({

                    success: false,

                    message:
                        "Invalid email or password."

                });

            }


            /*
            ---------------------------------------------
            UPDATE LAST LOGIN
            ---------------------------------------------
            */

            user.lastLogin =
                new Date();


            await user.save();


            /*
            ---------------------------------------------
            CREATE TOKEN
            ---------------------------------------------
            */

            const token =
                createToken(
                    user
                );


            /*
            ---------------------------------------------
            RESPONSE
            ---------------------------------------------
            */

            return res.status(200).json({

                success: true,

                message:
                    "Login successful.",

                token,

                user: {

                    id:
                        user._id,

                    name:
                        user.name,

                    email:
                        user.email,

                    phone:
                        user.phone,

                    role:
                        user.role,

                    dateOfBirth:
                        user.dateOfBirth,

                    gender:
                        user.gender

                }

            });

        }

        catch (error) {

            console.error(
                "LOGIN ERROR:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Unable to login."

            });

        }

    }
);


/*
=========================================================
GET CURRENT USER
=========================================================

GET

/api/auth/me


HEADER:

Authorization: Bearer YOUR_TOKEN

=========================================================
*/

router.get(
    "/me",
    auth,
    async (req, res) => {

        try {

            const user =
                await User.findById(
                    req.user.id
                );


            if (
                !user
            ) {

                return res.status(404).json({

                    success: false,

                    message:
                        "User account not found."

                });

            }


            if (
                user.isActive === false
            ) {

                return res.status(403).json({

                    success: false,

                    message:
                        "This account is inactive."

                });

            }


            return res.status(200).json({

                success: true,

                user: {

                    id:
                        user._id,

                    name:
                        user.name,

                    email:
                        user.email,

                    phone:
                        user.phone,

                    role:
                        user.role,

                    dateOfBirth:
                        user.dateOfBirth,

                    gender:
                        user.gender,

                    profileImage:
                        user.profileImage,

                    createdAt:
                        user.createdAt,

                    updatedAt:
                        user.updatedAt

                }

            });

        }

        catch (error) {

            console.error(
                "GET USER ERROR:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Unable to retrieve user profile."

            });

        }

    }
);


/*
=========================================================
UPDATE PROFILE
=========================================================

PUT

/api/auth/profile


HEADER:

Authorization: Bearer YOUR_TOKEN

BODY:

{
    "name": "Soumya Arya",
    "phone": "9876543210",
    "dateOfBirth": "2005-06-02",
    "gender": "female"
}

=========================================================
*/

router.put(
    "/profile",
    auth,
    async (req, res) => {

        try {

            const user =
                await User.findById(
                    req.user.id
                );


            if (
                !user
            ) {

                return res.status(404).json({

                    success: false,

                    message:
                        "User not found."

                });

            }


            /*
            ---------------------------------------------
            UPDATE NAME
            ---------------------------------------------
            */

            if (
                req.body.name !== undefined
            ) {

                const name =
                    req.body.name.trim();


                if (
                    name.length < 2
                ) {

                    return res.status(400).json({

                        success: false,

                        message:
                            "Name must contain at least 2 characters."

                    });

                }


                if (
                    name.length > 100
                ) {

                    return res.status(400).json({

                        success: false,

                        message:
                            "Name cannot exceed 100 characters."

                    });

                }


                user.name =
                    name;

            }


            /*
            ---------------------------------------------
            UPDATE PHONE
            ---------------------------------------------
            */

            if (
                req.body.phone !== undefined
            ) {

                user.phone =
                    req.body.phone
                        .trim();

            }


            /*
            ---------------------------------------------
            UPDATE DATE OF BIRTH
            ---------------------------------------------
            */

            if (
                req.body.dateOfBirth !== undefined
            ) {

                user.dateOfBirth =
                    req.body.dateOfBirth ||
                    null;

            }


            /*
            ---------------------------------------------
            UPDATE GENDER
            ---------------------------------------------
            */

            if (
                req.body.gender !== undefined
            ) {

                user.gender =
                    req.body.gender;

            }


            /*
            ---------------------------------------------
            UPDATE PROFILE IMAGE
            ---------------------------------------------
            */

            if (
                req.body.profileImage !== undefined
            ) {

                user.profileImage =
                    req.body.profileImage;

            }


            /*
            ---------------------------------------------
            SAVE
            ---------------------------------------------
            */

            await user.save();


            return res.status(200).json({

                success: true,

                message:
                    "Profile updated successfully.",

                user: {

                    id:
                        user._id,

                    name:
                        user.name,

                    email:
                        user.email,

                    phone:
                        user.phone,

                    role:
                        user.role,

                    dateOfBirth:
                        user.dateOfBirth,

                    gender:
                        user.gender,

                    profileImage:
                        user.profileImage

                }

            });

        }

        catch (error) {

            console.error(
                "PROFILE UPDATE ERROR:",
                error
            );


            if (
                error.name ===
                "ValidationError"
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Profile validation failed.",

                    errors:
                        Object.values(
                            error.errors
                        ).map(
                            error =>
                                error.message
                        )

                });

            }


            return res.status(500).json({

                success: false,

                message:
                    "Unable to update profile."

            });

        }

    }
);


/*
=========================================================
CHANGE PASSWORD
=========================================================

PUT

/api/auth/change-password


BODY:

{
    "currentPassword": "OldPassword123",
    "newPassword": "NewPassword123"
}

=========================================================
*/

router.put(
    "/change-password",
    auth,
    async (req, res) => {

        try {

            const {

                currentPassword,

                newPassword

            } = req.body;


            /*
            ---------------------------------------------
            REQUIRED FIELDS
            ---------------------------------------------
            */

            if (
                !currentPassword ||
                !newPassword
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Current password and new password are required."

                });

            }


            /*
            ---------------------------------------------
            VALIDATE NEW PASSWORD
            ---------------------------------------------
            */

            if (
                !isStrongPassword(
                    newPassword
                )
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "New password must contain at least 8 characters, one uppercase letter, one lowercase letter and one number."

                });

            }


            /*
            ---------------------------------------------
            FIND USER WITH PASSWORD
            ---------------------------------------------
            */

            const user =
                await User.findById(
                    req.user.id
                ).select(
                    "+password"
                );


            if (
                !user
            ) {

                return res.status(404).json({

                    success: false,

                    message:
                        "User not found."

                });

            }


            /*
            ---------------------------------------------
            CHECK CURRENT PASSWORD
            ---------------------------------------------
            */

            const currentPasswordCorrect =
                await bcrypt.compare(

                    currentPassword,

                    user.password

                );


            if (
                !currentPasswordCorrect
            ) {

                return res.status(401).json({

                    success: false,

                    message:
                        "Current password is incorrect."

                });

            }


            /*
            ---------------------------------------------
            PREVENT SAME PASSWORD
            ---------------------------------------------
            */

            const samePassword =
                await bcrypt.compare(

                    newPassword,

                    user.password

                );


            if (
                samePassword
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "New password must be different from your current password."

                });

            }


            /*
            ---------------------------------------------
            HASH NEW PASSWORD
            ---------------------------------------------
            */

            const salt =
                await bcrypt.genSalt(12);


            user.password =
                await bcrypt.hash(

                    newPassword,

                    salt

                );


            await user.save();


            /*
            ---------------------------------------------
            CREATE NEW TOKEN
            ---------------------------------------------
            */

            const token =
                createToken(
                    user
                );


            return res.status(200).json({

                success: true,

                message:
                    "Password changed successfully.",

                token

            });

        }

        catch (error) {

            console.error(
                "CHANGE PASSWORD ERROR:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Unable to change password."

            });

        }

    }
);


/*
=========================================================
LOGOUT
=========================================================

POST

/api/auth/logout

=========================================================

IMPORTANT:

JWT authentication is stateless.

Therefore, simply deleting the token from the browser
logs the user out on the frontend.

If you need server-side token revocation, implement a
token blacklist/session collection.

=========================================================
*/

router.post(
    "/logout",
    auth,
    async (req, res) => {

        try {

            /*
            No database operation is required for basic
            JWT logout.

            The frontend should remove the JWT from
            localStorage/sessionStorage or its cookie.
            */

            return res.status(200).json({

                success: true,

                message:
                    "Logged out successfully."

            });

        }

        catch (error) {

            console.error(
                "LOGOUT ERROR:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Unable to logout."

            });

        }

    }
);


/*
=========================================================
DELETE ACCOUNT
=========================================================

DELETE

/api/auth/account


HEADER:

Authorization: Bearer YOUR_TOKEN


BODY:

{
    "password": "Password123"
}

=========================================================

For a healthcare application, don't silently delete
medical records without considering retention,
audit, and legal requirements.

This route therefore requires the user's password.

=========================================================
*/

router.delete(
    "/account",
    auth,
    async (req, res) => {

        try {

            const {
                password
            } = req.body;


            if (
                !password
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Password is required to delete the account."

                });

            }


            /*
            ---------------------------------------------
            FIND USER
            ---------------------------------------------
            */

            const user =
                await User.findById(
                    req.user.id
                ).select(
                    "+password"
                );


            if (
                !user
            ) {

                return res.status(404).json({

                    success: false,

                    message:
                        "User account not found."

                });

            }


            /*
            ---------------------------------------------
            VERIFY PASSWORD
            ---------------------------------------------
            */

            const passwordCorrect =
                await bcrypt.compare(

                    password,

                    user.password

                );


            if (
                !passwordCorrect
            ) {

                return res.status(401).json({

                    success: false,

                    message:
                        "Incorrect password."

                });

            }


            /*
            ---------------------------------------------
            DELETE USER
            ---------------------------------------------
            */

            await User.deleteOne({

                _id:
                    req.user.id

            });


            /*
            IMPORTANT:

            If your application stores:

            - Appointments
            - Prescriptions
            - Reminders
            - Medical documents

            you should implement your own account-deletion
            policy instead of blindly deleting related
            healthcare records here.
            */


            return res.status(200).json({

                success: true,

                message:
                    "Account deleted successfully."

            });

        }

        catch (error) {

            console.error(
                "DELETE ACCOUNT ERROR:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Unable to delete account."

            });

        }

    }
);


/*
=========================================================
EXPORT ROUTER
=========================================================
*/

module.exports =
    router;
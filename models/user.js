const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");


/*
=========================================================
MEDCARE USER MODEL
=========================================================

This model stores registered MEDCARE users.

Important:
- Never store plain-text passwords.
- Passwords are converted into secure hashes.
- passwordHash is excluded from normal JSON responses.
- Email addresses are normalized.
=========================================================
*/


/*
=========================================================
USER SCHEMA
=========================================================
*/

const userSchema = new mongoose.Schema(
    {

        /*
        -------------------------------------------------
        BASIC USER INFORMATION
        -------------------------------------------------
        */

        name: {
            type: String,

            required: [
                true,
                "Full name is required."
            ],

            trim: true,

            minlength: [
                2,
                "Name must contain at least 2 characters."
            ],

            maxlength: [
                100,
                "Name cannot exceed 100 characters."
            ]
        },


        email: {
            type: String,

            required: [
                true,
                "Email address is required."
            ],

            unique: true,

            lowercase: true,

            trim: true,

            maxlength: 254,

            match: [
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                "Please enter a valid email address."
            ]
        },


        /*
        -------------------------------------------------
        PASSWORD
        -------------------------------------------------

        We store ONLY the hashed password.

        Example:

        User enters:
        myPassword123

        MongoDB stores:
        $2b$12$........................
        -------------------------------------------------
        */

        passwordHash: {
            type: String,

            required: [
                true,
                "Password hash is required."
            ],

            select: false
        },


        /*
        -------------------------------------------------
        PROFILE INFORMATION
        -------------------------------------------------
        */

        phone: {
            type: String,

            trim: true,

            default: ""
        },


        dateOfBirth: {
            type: Date,

            default: null
        },


        gender: {
            type: String,

            enum: [
                "male",
                "female",
                "other",
                "prefer_not_to_say",
                ""
            ],

            default: ""
        },


        /*
        -------------------------------------------------
        ADDRESS
        -------------------------------------------------
        */

        address: {

            street: {
                type: String,

                trim: true,

                default: ""
            },

            city: {
                type: String,

                trim: true,

                default: ""
            },

            state: {
                type: String,

                trim: true,

                default: ""
            },

            postalCode: {
                type: String,

                trim: true,

                default: ""
            },

            country: {
                type: String,

                trim: true,

                default: "India"
            }

        },


        /*
        -------------------------------------------------
        EMERGENCY CONTACT
        -------------------------------------------------
        */

        emergencyContact: {

            name: {
                type: String,

                trim: true,

                default: ""
            },

            relationship: {
                type: String,

                trim: true,

                default: ""
            },

            phone: {
                type: String,

                trim: true,

                default: ""
            }

        },


        /*
        -------------------------------------------------
        ACCOUNT STATUS
        -------------------------------------------------
        */

        isActive: {
            type: Boolean,

            default: true
        },


        /*
        -------------------------------------------------
        EMAIL VERIFICATION
        -------------------------------------------------
        */

        isEmailVerified: {
            type: Boolean,

            default: false
        },


        /*
        -------------------------------------------------
        LAST LOGIN
        -------------------------------------------------
        */

        lastLogin: {
            type: Date,

            default: null
        }

    },


    /*
    =====================================================
    MONGOOSE OPTIONS
    =====================================================
    */

    {
        timestamps: true,

        versionKey: false
    }
);


/*
=========================================================
INDEXES
=========================================================

Email is already unique, but explicitly defining the
index makes the intention clear.
=========================================================
*/

userSchema.index(
    {
        email: 1
    },
    {
        unique: true
    }
);


/*
=========================================================
PASSWORD HASHING
=========================================================

This middleware runs whenever passwordHash is modified.

For your registration route, we will create the hash
before saving the user.

This model also provides a helper method below for
cleaner authentication logic.
=========================================================
*/


userSchema.methods.setPassword = async function (
    password
) {

    if (!password) {

        throw new Error(
            "Password cannot be empty."
        );

    }


    if (password.length < 6) {

        throw new Error(
            "Password must contain at least 6 characters."
        );

    }


    const saltRounds = 12;


    this.passwordHash =
        await bcrypt.hash(
            password,
            saltRounds
        );
};


/*
=========================================================
PASSWORD COMPARISON
=========================================================

Used during login.

Example:

const valid =
    await user.comparePassword(password);
=========================================================
*/

userSchema.methods.comparePassword =
    async function (
        password
    ) {

        if (!password) {

            return false;

        }


        return bcrypt.compare(
            password,
            this.passwordHash
        );
    };


/*
=========================================================
SAFE USER OBJECT
=========================================================

Never send passwordHash to the frontend.

This method creates a safe object that can be returned
from API responses.
=========================================================
*/

userSchema.methods.toSafeObject =
    function () {

        return {

            id: this._id,

            name: this.name,

            email: this.email,

            phone: this.phone,

            dateOfBirth:
                this.dateOfBirth,

            gender:
                this.gender,

            address:
                this.address,

            emergencyContact:
                this.emergencyContact,

            isActive:
                this.isActive,

            isEmailVerified:
                this.isEmailVerified,

            lastLogin:
                this.lastLogin,

            createdAt:
                this.createdAt,

            updatedAt:
                this.updatedAt
        };
    };


/*
=========================================================
REMOVE SENSITIVE INFORMATION FROM JSON
=========================================================

Whenever:

res.json(user)

is called, passwordHash will not be included.
=========================================================
*/

userSchema.methods.toJSON =
    function () {

        const user =
            this.toObject();


        delete user.passwordHash;


        return user;
    };


/*
=========================================================
NORMALIZE EMAIL BEFORE VALIDATION
=========================================================
*/

userSchema.pre(
    "validate",
    function (next) {

        if (this.email) {

            this.email =
                this.email
                    .trim()
                    .toLowerCase();

        }


        next();
    }
);


/*
=========================================================
MODEL
=========================================================
*/

const User =
    mongoose.model(
        "User",
        userSchema
    );


module.exports = User;
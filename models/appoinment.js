const mongoose = require("mongoose");


/*
=========================================================
MEDCARE - APPOINTMENT MODEL
=========================================================

This model stores appointments booked by MEDCARE users.

Each appointment belongs to exactly one user.

Main functionality:

- Book an appointment
- Store doctor information
- Store appointment date and time
- Store reason for consultation
- Store appointment status
- Support online/in-person consultation
- Reschedule appointments
- Cancel appointments
- Store additional notes
- Track creation/update time

MongoDB collection:

appointments
=========================================================
*/


/*
=========================================================
APPOINTMENT SCHEMA
=========================================================
*/

const appointmentSchema = new mongoose.Schema(
    {

        /*
        =================================================
        USER REFERENCE
        =================================================

        Every appointment must belong to a registered
        MEDCARE user.

        Example:

        User
          ↓
        Appointment
        =================================================
        */

        user: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "User",

            required: [
                true,
                "User is required."
            ],

            index: true
        },


        /*
        =================================================
        DOCTOR INFORMATION
        =================================================
        */

        doctor: {

            type: String,

            required: [
                true,
                "Doctor name is required."
            ],

            trim: true,

            minlength: [
                2,
                "Doctor name must contain at least 2 characters."
            ],

            maxlength: [
                150,
                "Doctor name cannot exceed 150 characters."
            ]
        },


        /*
        =================================================
        DOCTOR SPECIALIZATION
        =================================================
        */

        specialization: {

            type: String,

            trim: true,

            maxlength: [
                100,
                "Specialization cannot exceed 100 characters."
            ],

            default: ""
        },


        /*
        =================================================
        APPOINTMENT DATE
        =================================================

        Stored as a Date so MongoDB can properly sort,
        query and compare appointments.

        Example:

        2026-10-15
        =================================================
        */

        date: {

            type: Date,

            required: [
                true,
                "Appointment date is required."
            ]
        },


        /*
        =================================================
        APPOINTMENT TIME
        =================================================

        We keep time separately because your frontend
        appointment form can provide a specific time.

        Example:

        10:30 AM

        Stored as:

        10:30
        =================================================
        */

        time: {

            type: String,

            required: [
                true,
                "Appointment time is required."
            ],

            trim: true,

            match: [
                /^([01]\d|2[0-3]):([0-5]\d)$/,

                "Appointment time must use HH:MM format."
            ]
        },


        /*
        =================================================
        CONSULTATION TYPE
        =================================================

        Supports:

        - In-person appointment
        - Online appointment
        =================================================
        */

        consultationType: {

            type: String,

            enum: {

                values: [
                    "in-person",
                    "online"
                ],

                message:
                    "Consultation type must be in-person or online."
            },

            default: "in-person"
        },


        /*
        =================================================
        APPOINTMENT REASON
        =================================================
        */

        reason: {

            type: String,

            trim: true,

            maxlength: [
                1000,
                "Reason cannot exceed 1000 characters."
            ],

            default: ""
        },


        /*
        =================================================
        PATIENT NOTES
        =================================================

        Additional information that the patient wants
        to provide before the consultation.
        =================================================
        */

        patientNotes: {

            type: String,

            trim: true,

            maxlength: [
                2000,
                "Patient notes cannot exceed 2000 characters."
            ],

            default: ""
        },


        /*
        =================================================
        APPOINTMENT STATUS
        =================================================

        Possible states:

        upcoming
        confirmed
        completed
        cancelled
        no-show

        =================================================
        */

        status: {

            type: String,

            enum: {

                values: [
                    "upcoming",
                    "confirmed",
                    "completed",
                    "cancelled",
                    "no-show"
                ],

                message:
                    "Invalid appointment status."
            },

            default: "upcoming",

            index: true
        },


        /*
        =================================================
        CANCELLATION INFORMATION
        =================================================
        */

        cancellationReason: {

            type: String,

            trim: true,

            maxlength: [
                500,
                "Cancellation reason cannot exceed 500 characters."
            ],

            default: ""
        },


        cancelledAt: {

            type: Date,

            default: null
        },


        /*
        =================================================
        RESCHEDULING INFORMATION
        =================================================

        Keeps track of whether the appointment was
        rescheduled.
        =================================================
        */

        isRescheduled: {

            type: Boolean,

            default: false
        },


        rescheduledFrom: {

            type: Date,

            default: null
        },


        /*
        =================================================
        PAYMENT INFORMATION
        =================================================
        */

        paymentStatus: {

            type: String,

            enum: {

                values: [
                    "not-required",
                    "pending",
                    "paid",
                    "refunded"
                ],

                message:
                    "Invalid payment status."
            },

            default: "not-required"
        },


        /*
        =================================================
        APPOINTMENT FEE
        =================================================
        */

        consultationFee: {

            type: Number,

            min: [
                0,
                "Consultation fee cannot be negative."
            ],

            default: 0
        },


        /*
        =================================================
        ONLINE CONSULTATION DETAILS
        =================================================

        These can remain empty for an in-person
        appointment.
        =================================================
        */

        meetingLink: {

            type: String,

            trim: true,

            default: ""
        },


        /*
        =================================================
        DOCTOR CONTACT
        =================================================
        */

        doctorContact: {

            type: String,

            trim: true,

            default: ""
        },


        /*
        =================================================
        CLINIC / HOSPITAL INFORMATION
        =================================================
        */

        clinicName: {

            type: String,

            trim: true,

            maxlength: [
                200,
                "Clinic name cannot exceed 200 characters."
            ],

            default: ""
        },


        clinicAddress: {

            type: String,

            trim: true,

            maxlength: [
                500,
                "Clinic address cannot exceed 500 characters."
            ],

            default: ""
        },


        /*
        =================================================
        REMINDER INFORMATION
        =================================================
        */

        reminderEnabled: {

            type: Boolean,

            default: true
        },


        reminderMinutesBefore: {

            type: Number,

            enum: [
                15,
                30,
                60,
                120,
                1440
            ],

            default: 60
        },


        /*
        =================================================
        INTERNAL NOTES
        =================================================

        This field can be used by your backend/admin
        system.

        Do not expose it to normal users if you later
        create an admin dashboard.
        =================================================
        */

        internalNotes: {

            type: String,

            trim: true,

            maxlength: [
                2000,
                "Internal notes cannot exceed 2000 characters."
            ],

            default: ""
        }

    },


    /*
    =====================================================
    SCHEMA OPTIONS
    =====================================================
    */

    {

        timestamps: true,

        versionKey: false

    }
);


/*
=========================================================
DATABASE INDEXES
=========================================================

These indexes make common appointment queries faster.

For example:

Get all appointments for a user.

Get upcoming appointments.

Sort appointments by date.
=========================================================
*/


appointmentSchema.index(
    {
        user: 1,
        date: 1,
        time: 1
    }
);


appointmentSchema.index(
    {
        user: 1,
        status: 1
    }
);


appointmentSchema.index(
    {
        doctor: 1,
        date: 1,
        time: 1
    }
);


/*
=========================================================
VALIDATION - APPOINTMENT DATE
=========================================================

Prevents creating an appointment with a date that is
already in the past.

NOTE:

This is mainly useful for new appointments.

When updating old appointments, your route should
handle the business rules appropriately.
=========================================================
*/

appointmentSchema.pre(
    "validate",
    function(next) {

        if (!this.date) {

            return next();

        }


        /*
        Remove time portion so we compare only the date.
        */

        const today = new Date();

        today.setHours(
            0,
            0,
            0,
            0
        );


        const appointmentDate =
            new Date(this.date);

        appointmentDate.setHours(
            0,
            0,
            0,
            0
        );


        /*
        Only reject past dates when this is a new
        appointment.
        */

        if (
            this.isNew &&
            appointmentDate < today
        ) {

            return next(
                new Error(
                    "Appointment date cannot be in the past."
                )
            );

        }


        next();

    }
);


/*
=========================================================
METHOD: CANCEL APPOINTMENT
=========================================================

Instead of manually changing multiple fields:

appointment.status = "cancelled";
appointment.cancelledAt = new Date();

we can simply use:

appointment.cancel(reason);

=========================================================
*/

appointmentSchema.methods.cancel =
    function(reason = "") {

        this.status =
            "cancelled";

        this.cancellationReason =
            reason.trim();

        this.cancelledAt =
            new Date();

        return this;
    };


/*
=========================================================
METHOD: CONFIRM APPOINTMENT
=========================================================
*/

appointmentSchema.methods.confirm =
    function() {

        if (
            this.status === "cancelled"
        ) {

            throw new Error(
                "A cancelled appointment cannot be confirmed."
            );

        }


        this.status =
            "confirmed";


        return this;
    };


/*
=========================================================
METHOD: COMPLETE APPOINTMENT
=========================================================
*/

appointmentSchema.methods.complete =
    function() {

        if (
            this.status === "cancelled"
        ) {

            throw new Error(
                "A cancelled appointment cannot be completed."
            );

        }


        this.status =
            "completed";


        return this;
    };


/*
=========================================================
METHOD: RESCHEDULE
=========================================================

Usage:

appointment.reschedule(
    newDate,
    newTime
);
=========================================================
*/

appointmentSchema.methods.reschedule =
    function(
        newDate,
        newTime
    ) {

        if (
            this.status === "cancelled"
        ) {

            throw new Error(
                "A cancelled appointment cannot be rescheduled."
            );

        }


        /*
        Save previous date.
        */

        this.rescheduledFrom =
            this.date;


        /*
        Set new appointment date.
        */

        this.date =
            new Date(newDate);


        /*
        Validate time.
        */

        const timeRegex =
            /^([01]\d|2[0-3]):([0-5]\d)$/;


        if (
            !timeRegex.test(newTime)
        ) {

            throw new Error(
                "Appointment time must use HH:MM format."
            );

        }


        this.time =
            newTime;


        this.isRescheduled =
            true;


        /*
        Return appointment so it can be saved.
        */

        return this;
    };


/*
=========================================================
METHOD: IS UPCOMING
=========================================================
*/

appointmentSchema.methods.isUpcoming =
    function() {

        return (
            this.status === "upcoming" ||
            this.status === "confirmed"
        );

    };


/*
=========================================================
METHOD: SAFE OBJECT
=========================================================

Useful when returning appointment information to the
frontend.

=========================================================
*/

appointmentSchema.methods.toSafeObject =
    function() {

        return {

            id:
                this._id,

            user:
                this.user,

            doctor:
                this.doctor,

            specialization:
                this.specialization,

            date:
                this.date,

            time:
                this.time,

            consultationType:
                this.consultationType,

            reason:
                this.reason,

            patientNotes:
                this.patientNotes,

            status:
                this.status,

            cancellationReason:
                this.cancellationReason,

            cancelledAt:
                this.cancelledAt,

            isRescheduled:
                this.isRescheduled,

            rescheduledFrom:
                this.rescheduledFrom,

            paymentStatus:
                this.paymentStatus,

            consultationFee:
                this.consultationFee,

            meetingLink:
                this.meetingLink,

            doctorContact:
                this.doctorContact,

            clinicName:
                this.clinicName,

            clinicAddress:
                this.clinicAddress,

            reminderEnabled:
                this.reminderEnabled,

            reminderMinutesBefore:
                this.reminderMinutesBefore,

            createdAt:
                this.createdAt,

            updatedAt:
                this.updatedAt

        };

    };


/*
=========================================================
JSON OUTPUT
=========================================================

This prevents internalNotes from accidentally being
sent to the normal frontend.

=========================================================
*/

appointmentSchema.methods.toJSON =
    function() {

        const appointment =
            this.toObject();


        /*
        Remove internal notes from normal API output.
        */

        delete appointment.internalNotes;


        return appointment;

    };


/*
=========================================================
CREATE MODEL
=========================================================
*/

const Appointment =
    mongoose.model(
        "Appointment",
        appointmentSchema
    );


/*
=========================================================
EXPORT MODEL
=========================================================
*/

module.exports =
    Appointment;
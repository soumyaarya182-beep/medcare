const mongoose = require("mongoose");


/*
=========================================================
MEDCARE - MEDICINE REMINDER MODEL
=========================================================

This model stores medicine reminders for a MEDCARE user.

Features:
- Medicine name
- Generic/brand name
- Dosage
- Medicine form
- Frequency
- Multiple reminder times
- Start/end dates
- Active/inactive status
- Before/after food instructions
- Doctor information
- Prescription information
- Refill information
- Reminder notification settings
- Reminder completion history
- Additional notes

MongoDB collection:

reminders
=========================================================
*/


/*
=========================================================
REMINDER TIME SUB-SCHEMA
=========================================================

A medicine can have more than one reminder per day.

Example:

Medicine:
Paracetamol

Times:
08:00
14:00
20:00

Each time is stored as a separate object.
=========================================================
*/

const reminderTimeSchema = new mongoose.Schema(
    {

        /*
        -------------------------------------------------
        TIME
        -------------------------------------------------

        Stored using 24-hour HH:MM format.

        Example:

        08:30
        14:00
        21:30
        -------------------------------------------------
        */

        time: {

            type: String,

            required: [
                true,
                "Reminder time is required."
            ],

            trim: true,

            match: [
                /^([01]\d|2[0-3]):([0-5]\d)$/,

                "Reminder time must use HH:MM format."
            ]
        },


        /*
        -------------------------------------------------
        ACTIVE STATUS
        -------------------------------------------------
        */

        enabled: {

            type: Boolean,

            default: true
        }

    },

    {
        _id: true
    }
);


/*
=========================================================
REMINDER SCHEMA
=========================================================
*/

const reminderSchema = new mongoose.Schema(
    {

        /*
        =================================================
        USER
        =================================================

        Every reminder belongs to one MEDCARE user.

        This is extremely important because one user
        must not be able to access another user's
        medicine reminders.
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
        MEDICINE NAME
        =================================================

        Example:

        Paracetamol
        Metformin
        Amoxicillin
        =================================================
        */

        medicineName: {

            type: String,

            required: [
                true,
                "Medicine name is required."
            ],

            trim: true,

            minlength: [
                2,
                "Medicine name must contain at least 2 characters."
            ],

            maxlength: [
                150,
                "Medicine name cannot exceed 150 characters."
            ]
        },


        /*
        =================================================
        GENERIC NAME
        =================================================

        Optional generic medicine name.

        Example:

        Paracetamol
        =================================================
        */

        genericName: {

            type: String,

            trim: true,

            maxlength: [
                150,
                "Generic name cannot exceed 150 characters."
            ],

            default: ""
        },


        /*
        =================================================
        BRAND NAME
        =================================================
        */

        brandName: {

            type: String,

            trim: true,

            maxlength: [
                150,
                "Brand name cannot exceed 150 characters."
            ],

            default: ""
        },


        /*
        =================================================
        DOSAGE
        =================================================

        Example:

        500 mg
        10 ml
        1 tablet
        =================================================
        */

        dosage: {

            type: String,

            required: [
                true,
                "Medicine dosage is required."
            ],

            trim: true,

            maxlength: [
                100,
                "Dosage cannot exceed 100 characters."
            ]
        },


        /*
        =================================================
        MEDICINE FORM
        =================================================

        Examples:

        tablet
        capsule
        syrup
        injection
        cream
        drops
        inhaler
        =================================================
        */

        medicineForm: {

            type: String,

            enum: {

                values: [
                    "tablet",
                    "capsule",
                    "syrup",
                    "injection",
                    "cream",
                    "ointment",
                    "drops",
                    "inhaler",
                    "powder",
                    "other",
                    ""
                ],

                message:
                    "Invalid medicine form."
            },

            default: ""
        },


        /*
        =================================================
        FREQUENCY
        =================================================

        Determines how often the medicine should be
        taken.

        =================================================
        */

        frequency: {

            type: String,

            enum: {

                values: [
                    "once-daily",
                    "twice-daily",
                    "three-times-daily",
                    "four-times-daily",
                    "as-needed",
                    "weekly",
                    "custom"
                ],

                message:
                    "Invalid medicine frequency."
            },

            default: "once-daily"
        },


        /*
        =================================================
        REMINDER TIMES
        =================================================

        Supports multiple doses per day.

        Example:

        [
            { time: "08:00", enabled: true },
            { time: "14:00", enabled: true },
            { time: "20:00", enabled: true }
        ]
        =================================================
        */

        reminderTimes: {

            type: [
                reminderTimeSchema
            ],

            required: [
                true,
                "At least one reminder time is required."
            ],

            validate: {

                validator: function(times) {

                    return (
                        Array.isArray(times) &&
                        times.length > 0
                    );

                },

                message:
                    "At least one reminder time is required."
            }
        },


        /*
        =================================================
        START DATE
        =================================================

        Date on which medicine reminders begin.
        =================================================
        */

        startDate: {

            type: Date,

            required: [
                true,
                "Medicine start date is required."
            ]
        },


        /*
        =================================================
        END DATE
        =================================================

        Optional.

        Some medicines may be taken indefinitely.
        =================================================
        */

        endDate: {

            type: Date,

            default: null
        },


        /*
        =================================================
        ACTIVE STATUS
        =================================================

        Allows the user to temporarily disable a reminder
        without deleting it.
        =================================================
        */

        active: {

            type: Boolean,

            default: true,

            index: true
        },


        /*
        =================================================
        MEAL INSTRUCTION
        =================================================

        Examples:

        before-food
        after-food
        with-food
        empty-stomach
        anytime
        =================================================
        */

        mealInstruction: {

            type: String,

            enum: {

                values: [
                    "before-food",
                    "after-food",
                    "with-food",
                    "empty-stomach",
                    "anytime"
                ],

                message:
                    "Invalid meal instruction."
            },

            default: "anytime"
        },


        /*
        =================================================
        DOCTOR INFORMATION
        =================================================
        */

        doctorName: {

            type: String,

            trim: true,

            maxlength: [
                150,
                "Doctor name cannot exceed 150 characters."
            ],

            default: ""
        },


        doctorContact: {

            type: String,

            trim: true,

            maxlength: [
                30,
                "Doctor contact cannot exceed 30 characters."
            ],

            default: ""
        },


        /*
        =================================================
        PRESCRIPTION INFORMATION
        =================================================
        */

        prescriptionId: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "Prescription",

            default: null
        },


        /*
        =================================================
        QUANTITY INFORMATION
        =================================================

        Example:

        quantity = 30
        unit = tablets
        =================================================
        */

        quantity: {

            type: Number,

            min: [
                0,
                "Quantity cannot be negative."
            ],

            default: null
        },


        quantityUnit: {

            type: String,

            enum: {

                values: [
                    "tablets",
                    "capsules",
                    "ml",
                    "doses",
                    "units",
                    "tubes",
                    "bottles",
                    "other",
                    ""
                ],

                message:
                    "Invalid quantity unit."
            },

            default: ""
        },


        /*
        =================================================
        REFILL INFORMATION
        =================================================
        */

        refillReminderEnabled: {

            type: Boolean,

            default: false
        },


        refillThreshold: {

            type: Number,

            min: [
                0,
                "Refill threshold cannot be negative."
            ],

            default: null
        },


        /*
        =================================================
        NOTIFICATION SETTINGS
        =================================================
        */

        notificationEnabled: {

            type: Boolean,

            default: true
        },


        notificationMinutesBefore: {

            type: Number,

            enum: {

                values: [
                    0,
                    5,
                    10,
                    15,
                    30,
                    60
                ],

                message:
                    "Invalid notification time."
            },

            default: 0
        },


        /*
        =================================================
        REMINDER HISTORY
        =================================================

        Stores whether a scheduled dose was taken,
        skipped, or missed.

        This can later be used to create a medication
        adherence dashboard.
        =================================================
        */

        doseHistory: [

            {

                scheduledAt: {

                    type: Date,

                    required: true
                },


                status: {

                    type: String,

                    enum: [
                        "pending",
                        "taken",
                        "skipped",
                        "missed"
                    ],

                    default: "pending"
                },


                takenAt: {

                    type: Date,

                    default: null
                },


                note: {

                    type: String,

                    trim: true,

                    maxlength: 500,

                    default: ""
                }

            }

        ],


        /*
        =================================================
        ADDITIONAL NOTES
        =================================================
        */

        notes: {

            type: String,

            trim: true,

            maxlength: [
                2000,
                "Notes cannot exceed 2000 characters."
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

These indexes improve queries such as:

- Get all reminders for a user
- Get active reminders
- Get reminders for a particular date
=========================================================
*/

reminderSchema.index(
    {
        user: 1,
        active: 1
    }
);


reminderSchema.index(
    {
        user: 1,
        startDate: 1,
        endDate: 1
    }
);


reminderSchema.index(
    {
        user: 1,
        "reminderTimes.time": 1
    }
);


/*
=========================================================
VALIDATION - DATE RANGE
=========================================================

Ensures:

endDate >= startDate

=========================================================
*/

reminderSchema.pre(
    "validate",
    function(next) {

        if (
            this.startDate &&
            this.endDate
        ) {

            const start =
                new Date(this.startDate);

            const end =
                new Date(this.endDate);


            if (end < start) {

                return next(
                    new Error(
                        "End date cannot be before start date."
                    )
                );

            }

        }


        next();

    }
);


/*
=========================================================
VALIDATION - REMINDER TIMES
=========================================================

Prevents duplicate reminder times.

Example:

08:00
08:00

is not allowed.

=========================================================
*/

reminderSchema.pre(
    "validate",
    function(next) {

        if (
            !this.reminderTimes ||
            this.reminderTimes.length === 0
        ) {

            return next();

        }


        const enabledTimes =
            this.reminderTimes
                .filter(
                    item => item.enabled
                )
                .map(
                    item => item.time
                );


        const uniqueTimes =
            new Set(enabledTimes);


        if (
            uniqueTimes.size !==
            enabledTimes.length
        ) {

            return next(
                new Error(
                    "Duplicate reminder times are not allowed."
                )
            );

        }


        next();

    }
);


/*
=========================================================
METHOD: ACTIVATE REMINDER
=========================================================
*/

reminderSchema.methods.activate =
    function() {

        this.active = true;

        return this;
    };


/*
=========================================================
METHOD: DEACTIVATE REMINDER
=========================================================
*/

reminderSchema.methods.deactivate =
    function() {

        this.active = false;

        return this;
    };


/*
=========================================================
METHOD: ADD REMINDER TIME
=========================================================

Example:

reminder.addReminderTime("18:30");
=========================================================
*/

reminderSchema.methods.addReminderTime =
    function(time) {

        const timeRegex =
            /^([01]\d|2[0-3]):([0-5]\d)$/;


        if (
            !timeRegex.test(time)
        ) {

            throw new Error(
                "Reminder time must use HH:MM format."
            );

        }


        const alreadyExists =
            this.reminderTimes.some(
                item =>
                    item.time === time &&
                    item.enabled
            );


        if (alreadyExists) {

            throw new Error(
                "This reminder time already exists."
            );

        }


        this.reminderTimes.push({
            time,
            enabled: true
        });


        return this;
    };


/*
=========================================================
METHOD: REMOVE REMINDER TIME
=========================================================
*/

reminderSchema.methods.removeReminderTime =
    function(time) {

        this.reminderTimes =
            this.reminderTimes.filter(
                item =>
                    item.time !== time
            );


        return this;
    };


/*
=========================================================
METHOD: RECORD DOSE
=========================================================

Marks a scheduled medicine dose as:

taken
skipped
missed

=========================================================
*/

reminderSchema.methods.recordDose =
    function(
        scheduledAt,
        status,
        note = ""
    ) {

        const validStatuses = [
            "taken",
            "skipped",
            "missed"
        ];


        if (
            !validStatuses.includes(status)
        ) {

            throw new Error(
                "Invalid dose status."
            );

        }


        this.doseHistory.push({

            scheduledAt:
                new Date(scheduledAt),

            status,

            takenAt:
                status === "taken"
                    ? new Date()
                    : null,

            note:
                note.trim()

        });


        return this;
    };


/*
=========================================================
METHOD: GET ACTIVE TIMES
=========================================================
*/

reminderSchema.methods.getActiveTimes =
    function() {

        return this.reminderTimes
            .filter(
                item =>
                    item.enabled
            )
            .map(
                item =>
                    item.time
            );
    };


/*
=========================================================
METHOD: IS CURRENTLY ACTIVE
=========================================================

Checks:

1. active === true
2. Current date >= startDate
3. Current date <= endDate, if an end date exists

=========================================================
*/

reminderSchema.methods.isCurrentlyActive =
    function() {

        if (!this.active) {

            return false;

        }


        const now =
            new Date();


        const start =
            new Date(
                this.startDate
            );


        /*
        Ignore time portion when comparing dates.
        */

        start.setHours(
            0,
            0,
            0,
            0
        );


        if (
            now < start
        ) {

            return false;

        }


        if (this.endDate) {

            const end =
                new Date(
                    this.endDate
                );


            end.setHours(
                23,
                59,
                59,
                999
            );


            if (
                now > end
            ) {

                return false;

            }

        }


        return true;
    };


/*
=========================================================
METHOD: SAFE OBJECT
=========================================================

Returns the fields that are safe and useful for the
normal frontend.

=========================================================
*/

reminderSchema.methods.toSafeObject =
    function() {

        return {

            id:
                this._id,

            user:
                this.user,

            medicineName:
                this.medicineName,

            genericName:
                this.genericName,

            brandName:
                this.brandName,

            dosage:
                this.dosage,

            medicineForm:
                this.medicineForm,

            frequency:
                this.frequency,

            reminderTimes:
                this.reminderTimes,

            startDate:
                this.startDate,

            endDate:
                this.endDate,

            active:
                this.active,

            mealInstruction:
                this.mealInstruction,

            doctorName:
                this.doctorName,

            doctorContact:
                this.doctorContact,

            prescriptionId:
                this.prescriptionId,

            quantity:
                this.quantity,

            quantityUnit:
                this.quantityUnit,

            refillReminderEnabled:
                this.refillReminderEnabled,

            refillThreshold:
                this.refillThreshold,

            notificationEnabled:
                this.notificationEnabled,

            notificationMinutesBefore:
                this.notificationMinutesBefore,

            doseHistory:
                this.doseHistory,

            notes:
                this.notes,

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

Returns a clean object when sending the reminder to
the frontend.
=========================================================
*/

reminderSchema.methods.toJSON =
    function() {

        return this.toSafeObject();

    };


/*
=========================================================
CREATE MODEL
=========================================================
*/

const Reminder =
    mongoose.model(
        "Reminder",
        reminderSchema
    );


/*
=========================================================
EXPORT MODEL
=========================================================
*/

module.exports =
    Reminder;
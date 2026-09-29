const mongoose = require("mongoose");


/*
=========================================================
MEDCARE - PRESCRIPTION MODEL
=========================================================

This model stores prescriptions issued to MEDCARE users.

A prescription can contain multiple medicines.

Example:

Prescription
    |
    |--- Doctor
    |--- Prescription Date
    |--- Diagnosis
    |--- Medicines
    |       |--- Medicine 1
    |       |--- Medicine 2
    |       |--- Medicine 3
    |
    |--- Instructions
    |--- Follow-up Date
    |--- Notes

MongoDB collection:

prescriptions
=========================================================
*/


/*
=========================================================
MEDICINE SUB-SCHEMA
=========================================================

A prescription can contain multiple medicines.

Example:

[
    {
        medicineName: "Paracetamol",
        dosage: "500 mg",
        frequency: "twice-daily",
        duration: 5
    },

    {
        medicineName: "Amoxicillin",
        dosage: "500 mg",
        frequency: "three-times-daily",
        duration: 7
    }
]

=========================================================
*/

const medicineSchema = new mongoose.Schema(
    {

        /*
        -------------------------------------------------
        MEDICINE NAME
        -------------------------------------------------
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
        -------------------------------------------------
        GENERIC NAME
        -------------------------------------------------
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
        -------------------------------------------------
        DOSAGE
        -------------------------------------------------

        Examples:

        500 mg
        10 ml
        1 tablet
        -------------------------------------------------
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
        -------------------------------------------------
        FORM
        -------------------------------------------------

        Examples:

        tablet
        capsule
        syrup
        injection
        cream
        drops
        -------------------------------------------------
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
        -------------------------------------------------
        FREQUENCY
        -------------------------------------------------

        How often the medicine should be taken.
        -------------------------------------------------
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

            required: [
                true,
                "Medicine frequency is required."
            ]
        },


        /*
        -------------------------------------------------
        SPECIFIC TIMES
        -------------------------------------------------

        Example:

        ["08:00", "14:00", "20:00"]

        This allows the frontend to create medicine
        reminders from the prescription.
        -------------------------------------------------
        */

        times: {

            type: [
                String
            ],

            default: []
        },


        /*
        -------------------------------------------------
        DURATION
        -------------------------------------------------
        */

        duration: {

            type: Number,

            min: [
                1,
                "Duration must be at least 1 day."
            ],

            default: null
        },


        /*
        -------------------------------------------------
        DURATION UNIT
        -------------------------------------------------
        */

        durationUnit: {

            type: String,

            enum: {

                values: [
                    "days",
                    "weeks",
                    "months",
                    ""
                ],

                message:
                    "Invalid duration unit."
            },

            default: "days"
        },


        /*
        -------------------------------------------------
        START DATE
        -------------------------------------------------
        */

        startDate: {

            type: Date,

            default: null
        },


        /*
        -------------------------------------------------
        END DATE
        -------------------------------------------------
        */

        endDate: {

            type: Date,

            default: null
        },


        /*
        -------------------------------------------------
        MEAL INSTRUCTION
        -------------------------------------------------

        Examples:

        before-food
        after-food
        with-food
        empty-stomach
        anytime
        -------------------------------------------------
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
        -------------------------------------------------
        QUANTITY
        -------------------------------------------------
        */

        quantity: {

            type: Number,

            min: [
                0,
                "Quantity cannot be negative."
            ],

            default: null
        },


        /*
        -------------------------------------------------
        QUANTITY UNIT
        -------------------------------------------------
        */

        quantityUnit: {

            type: String,

            enum: {

                values: [
                    "tablets",
                    "capsules",
                    "ml",
                    "doses",
                    "units",
                    "bottles",
                    "tubes",
                    "other",
                    ""
                ],

                message:
                    "Invalid quantity unit."
            },

            default: ""
        },


        /*
        -------------------------------------------------
        MEDICINE INSTRUCTIONS
        -------------------------------------------------
        */

        instructions: {

            type: String,

            trim: true,

            maxlength: [
                1000,
                "Medicine instructions cannot exceed 1000 characters."
            ],

            default: ""
        }

    },

    {
        _id: true
    }
);


/*
=========================================================
PRESCRIPTION SCHEMA
=========================================================
*/

const prescriptionSchema = new mongoose.Schema(
    {

        /*
        =================================================
        USER REFERENCE
        =================================================

        Every prescription belongs to a MEDCARE user.
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
        PRESCRIPTION TITLE
        =================================================

        Example:

        General Health Prescription
        Fever Treatment
        Post-Operative Prescription
        =================================================
        */

        title: {

            type: String,

            required: [
                true,
                "Prescription title is required."
            ],

            trim: true,

            minlength: [
                2,
                "Prescription title must contain at least 2 characters."
            ],

            maxlength: [
                200,
                "Prescription title cannot exceed 200 characters."
            ]
        },


        /*
        =================================================
        PRESCRIPTION NUMBER
        =================================================

        A unique human-readable identifier.

        Example:

        MED-2026-000123
        =================================================
        */

        prescriptionNumber: {

            type: String,

            unique: true,

            sparse: true,

            trim: true,

            maxlength: [
                50,
                "Prescription number cannot exceed 50 characters."
            ]
        },


        /*
        =================================================
        DOCTOR INFORMATION
        =================================================
        */

        doctorName: {

            type: String,

            required: [
                true,
                "Doctor name is required."
            ],

            trim: true,

            maxlength: [
                150,
                "Doctor name cannot exceed 150 characters."
            ]
        },


        doctorSpecialization: {

            type: String,

            trim: true,

            maxlength: [
                150,
                "Doctor specialization cannot exceed 150 characters."
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
        PRESCRIPTION DATE
        =================================================
        */

        prescriptionDate: {

            type: Date,

            required: [
                true,
                "Prescription date is required."
            ],

            default: Date.now
        },


        /*
        =================================================
        VALID UNTIL
        =================================================
        */

        validUntil: {

            type: Date,

            default: null
        },


        /*
        =================================================
        DIAGNOSIS
        =================================================

        The diagnosis associated with the prescription.

        This should be information supplied by the
        healthcare professional, not generated by the
        application.
        =================================================
        */

        diagnosis: {

            type: String,

            trim: true,

            maxlength: [
                1000,
                "Diagnosis cannot exceed 1000 characters."
            ],

            default: ""
        },


        /*
        =================================================
        SYMPTOMS / REASON
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
        MEDICINES
        =================================================

        A prescription can contain multiple medicines.
        =================================================
        */

        medicines: {

            type: [
                medicineSchema
            ],

            required: [
                true,
                "At least one medicine is required."
            ],

            validate: {

                validator: function(
                    medicines
                ) {

                    return (
                        Array.isArray(medicines) &&
                        medicines.length > 0
                    );

                },

                message:
                    "A prescription must contain at least one medicine."
            }
        },


        /*
        =================================================
        GENERAL INSTRUCTIONS
        =================================================
        */

        instructions: {

            type: String,

            trim: true,

            maxlength: [
                3000,
                "Instructions cannot exceed 3000 characters."
            ],

            default: ""
        },


        /*
        =================================================
        FOLLOW-UP DATE
        =================================================
        */

        followUpDate: {

            type: Date,

            default: null
        },


        /*
        =================================================
        FOLLOW-UP NOTES
        =================================================
        */

        followUpNotes: {

            type: String,

            trim: true,

            maxlength: [
                2000,
                "Follow-up notes cannot exceed 2000 characters."
            ],

            default: ""
        },


        /*
        =================================================
        PRESCRIPTION STATUS
        =================================================

        active:
            Prescription is currently being followed.

        completed:
            Treatment/prescription period is completed.

        expired:
            Prescription is past its validity date.

        cancelled:
            Prescription has been cancelled by an
            authorized healthcare professional/system.

        =================================================
        */

        status: {

            type: String,

            enum: {

                values: [
                    "active",
                    "completed",
                    "expired",
                    "cancelled"
                ],

                message:
                    "Invalid prescription status."
            },

            default: "active",

            index: true
        },


        /*
        =================================================
        REFILL INFORMATION
        =================================================
        */

        refillAllowed: {

            type: Boolean,

            default: false
        },


        refillCount: {

            type: Number,

            min: [
                0,
                "Refill count cannot be negative."
            ],

            default: 0
        },


        maximumRefills: {

            type: Number,

            min: [
                0,
                "Maximum refills cannot be negative."
            ],

            default: 0
        },


        /*
        =================================================
        ATTACHMENT INFORMATION
        =================================================

        If later you implement prescription image/PDF
        uploads, this field can store the file metadata.

        The actual file should preferably be stored in
        secure cloud/object storage rather than directly
        inside MongoDB.
        =================================================
        */

        attachment: {

            fileName: {

                type: String,

                trim: true,

                default: ""
            },


            fileUrl: {

                type: String,

                trim: true,

                default: ""
            },


            fileType: {

                type: String,

                trim: true,

                default: ""
            },


            uploadedAt: {

                type: Date,

                default: null
            }

        },


        /*
        =================================================
        NOTES
        =================================================
        */

        notes: {

            type: String,

            trim: true,

            maxlength: [
                3000,
                "Notes cannot exceed 3000 characters."
            ],

            default: ""
        },


        /*
        =================================================
        CREATED BY
        =================================================

        Useful if you later have different types of
        users such as:

        patient
        doctor
        admin

        For now this can remain the same as the patient
        user or be populated by a doctor/admin system
        later.
        =================================================
        */

        createdBy: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "User",

            default: null
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
*/

prescriptionSchema.index(
    {
        user: 1,
        prescriptionDate: -1
    }
);


prescriptionSchema.index(
    {
        user: 1,
        status: 1
    }
);


prescriptionSchema.index(
    {
        doctorName: 1
    }
);


/*
=========================================================
VALIDATION - PRESCRIPTION DATES
=========================================================

validUntil cannot be earlier than prescriptionDate.
=========================================================
*/

prescriptionSchema.pre(
    "validate",
    function(next) {

        if (
            this.prescriptionDate &&
            this.validUntil
        ) {

            const prescriptionDate =
                new Date(
                    this.prescriptionDate
                );


            const validUntil =
                new Date(
                    this.validUntil
                );


            if (
                validUntil <
                prescriptionDate
            ) {

                return next(
                    new Error(
                        "Prescription validity date cannot be before prescription date."
                    )
                );

            }

        }


        next();

    }
);


/*
=========================================================
VALIDATION - FOLLOW-UP DATE
=========================================================
*/

prescriptionSchema.pre(
    "validate",
    function(next) {

        if (
            this.followUpDate &&
            this.prescriptionDate
        ) {

            const followUp =
                new Date(
                    this.followUpDate
                );


            const prescription =
                new Date(
                    this.prescriptionDate
                );


            if (
                followUp <
                prescription
            ) {

                return next(
                    new Error(
                        "Follow-up date cannot be before prescription date."
                    )
                );

            }

        }


        next();

    }
);


/*
=========================================================
VALIDATION - MEDICINE DATE RANGE
=========================================================

Each medicine's end date cannot be before its start
date.
=========================================================
*/

prescriptionSchema.pre(
    "validate",
    function(next) {

        if (
            !this.medicines ||
            this.medicines.length === 0
        ) {

            return next();

        }


        for (
            const medicine
            of this.medicines
        ) {

            if (
                medicine.startDate &&
                medicine.endDate
            ) {

                const start =
                    new Date(
                        medicine.startDate
                    );


                const end =
                    new Date(
                        medicine.endDate
                    );


                if (
                    end < start
                ) {

                    return next(
                        new Error(
                            `End date cannot be before start date for ${medicine.medicineName}.`
                        )
                    );

                }

            }

        }


        next();

    }
);


/*
=========================================================
METHOD: ADD MEDICINE
=========================================================

Allows another medicine to be added to a prescription.

Example:

prescription.addMedicine({
    medicineName: "Paracetamol",
    dosage: "500 mg",
    frequency: "twice-daily"
});
=========================================================
*/

prescriptionSchema.methods.addMedicine =
    function(
        medicine
    ) {

        if (
            !medicine ||
            !medicine.medicineName
        ) {

            throw new Error(
                "Medicine name is required."
            );

        }


        const duplicate =
            this.medicines.some(
                existing =>
                    existing.medicineName
                        .toLowerCase() ===
                    medicine.medicineName
                        .trim()
                        .toLowerCase()
            );


        if (duplicate) {

            throw new Error(
                "This medicine already exists in the prescription."
            );

        }


        this.medicines.push(
            medicine
        );


        return this;

    };


/*
=========================================================
METHOD: REMOVE MEDICINE
=========================================================
*/

prescriptionSchema.methods.removeMedicine =
    function(
        medicineId
    ) {

        this.medicines =
            this.medicines.filter(
                medicine =>
                    medicine._id
                        .toString() !==
                    medicineId.toString()
            );


        return this;

    };


/*
=========================================================
METHOD: COMPLETE PRESCRIPTION
=========================================================
*/

prescriptionSchema.methods.complete =
    function() {

        this.status =
            "completed";


        return this;

    };


/*
=========================================================
METHOD: CANCEL PRESCRIPTION
=========================================================
*/

prescriptionSchema.methods.cancel =
    function() {

        this.status =
            "cancelled";


        return this;

    };


/*
=========================================================
METHOD: ACTIVATE PRESCRIPTION
=========================================================
*/

prescriptionSchema.methods.activate =
    function() {

        this.status =
            "active";


        return this;

    };


/*
=========================================================
METHOD: CHECK EXPIRY
=========================================================

Automatically determines whether the prescription has
passed its validity date.
=========================================================
*/

prescriptionSchema.methods.isExpired =
    function() {

        if (
            !this.validUntil
        ) {

            return false;

        }


        const now =
            new Date();


        return (
            now >
            new Date(
                this.validUntil
            )
        );

    };


/*
=========================================================
METHOD: UPDATE EXPIRY STATUS
=========================================================
*/

prescriptionSchema.methods.updateExpiryStatus =
    function() {

        if (
            this.status === "active" &&
            this.isExpired()
        ) {

            this.status =
                "expired";

        }


        return this;

    };


/*
=========================================================
METHOD: REFILL
=========================================================

Records a refill if refills are allowed.
=========================================================
*/

prescriptionSchema.methods.refill =
    function() {

        if (
            !this.refillAllowed
        ) {

            throw new Error(
                "Refills are not allowed for this prescription."
            );

        }


        if (
            this.maximumRefills > 0 &&
            this.refillCount >=
                this.maximumRefills
        ) {

            throw new Error(
                "Maximum number of refills has been reached."
            );

        }


        this.refillCount += 1;


        return this;

    };


/*
=========================================================
METHOD: GET MEDICINE NAMES
=========================================================
*/

prescriptionSchema.methods.getMedicineNames =
    function() {

        return this.medicines.map(
            medicine =>
                medicine.medicineName
        );

    };


/*
=========================================================
METHOD: GET ACTIVE MEDICINES
=========================================================

Returns medicines whose treatment period has not ended.
=========================================================
*/

prescriptionSchema.methods.getActiveMedicines =
    function() {

        const today =
            new Date();


        return this.medicines.filter(
            medicine => {

                /*
                No end date means it is currently active.
                */

                if (
                    !medicine.endDate
                ) {

                    return true;

                }


                return (
                    today <=
                    new Date(
                        medicine.endDate
                    )
                );

            }
        );

    };


/*
=========================================================
SAFE OBJECT
=========================================================

Returns information that can safely be sent to the
frontend.

=========================================================
*/

prescriptionSchema.methods.toSafeObject =
    function() {

        return {

            id:
                this._id,

            user:
                this.user,

            title:
                this.title,

            prescriptionNumber:
                this.prescriptionNumber,

            doctorName:
                this.doctorName,

            doctorSpecialization:
                this.doctorSpecialization,

            doctorContact:
                this.doctorContact,

            clinicName:
                this.clinicName,

            clinicAddress:
                this.clinicAddress,

            prescriptionDate:
                this.prescriptionDate,

            validUntil:
                this.validUntil,

            diagnosis:
                this.diagnosis,

            reason:
                this.reason,

            medicines:
                this.medicines,

            instructions:
                this.instructions,

            followUpDate:
                this.followUpDate,

            followUpNotes:
                this.followUpNotes,

            status:
                this.status,

            refillAllowed:
                this.refillAllowed,

            refillCount:
                this.refillCount,

            maximumRefills:
                this.maximumRefills,

            attachment:
                this.attachment,

            notes:
                this.notes,

            createdBy:
                this.createdBy,

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
*/

prescriptionSchema.methods.toJSON =
    function() {

        return this.toSafeObject();

    };


/*
=========================================================
CREATE MODEL
=========================================================
*/

const Prescription =
    mongoose.model(
        "Prescription",
        prescriptionSchema
    );


/*
=========================================================
EXPORT MODEL
=========================================================
*/

module.exports =
    Prescription;
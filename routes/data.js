/*
=========================================================
MEDCARE - DATA.JS
=========================================================

Purpose:
Centralized frontend data for the MEDCARE website.

This file contains:
    1. Application configuration
    2. Navigation data
    3. Departments
    4. Services
    5. Doctors
    6. Medicine categories
    7. Appointment options
    8. Reminder options
    9. FAQ data
    10. Dashboard statistics
    11. Emergency information
    12. Validation options
    13. Helper functions

IMPORTANT:
This file contains FRONTEND data only.

Do NOT put:
    - MongoDB passwords
    - JWT secrets
    - API secrets
    - private patient information
    - authentication tokens

inside this file.

=========================================================
*/


"use strict";


/*
=========================================================
1. APPLICATION CONFIGURATION
=========================================================
*/

const MEDCARE_CONFIG = {

    /*
    Application name
    */

    appName: "MedCare",

    appFullName:
        "MedCare Healthcare Management System",

    version: "1.0.0",

    environment:
        "development",


    /*
    Backend API URL

    Change this when deploying your backend.

    Local development:
    http://localhost:5000/api

    Production example:
    https://your-backend-domain.com/api
    */

    apiBaseUrl:
        "http://localhost:5000/api",


    /*
    Frontend URL
    */

    frontendUrl:
        "http://localhost:3000",


    /*
    Default pagination
    */

    defaultPageSize: 10,

    maximumPageSize: 100,


    /*
    Appointment settings
    */

    appointmentDuration: 30,

    appointmentStartHour: 9,

    appointmentEndHour: 18,


    /*
    Currency

    Change according to your application.
    */

    currency: "INR",

    currencySymbol: "₹",


    /*
    Date format
    */

    dateFormat:
        "DD/MM/YYYY",


    /*
    Time format
    */

    timeFormat:
        "HH:mm",


    /*
    Local storage keys
    */

    storageKeys: {

        token:
            "medcare_token",

        user:
            "medcare_user",

        theme:
            "medcare_theme",

        rememberMe:
            "medcare_remember_me"

    }

};


/*
=========================================================
2. NAVIGATION DATA
=========================================================
*/

const NAVIGATION_ITEMS = [

    {
        id: "home",
        label: "Home",
        url: "index.html",
        icon: "home",
        requiresAuth: false
    },

    {
        id: "doctors",
        label: "Doctors",
        url: "doctors.html",
        icon: "user-md",
        requiresAuth: false
    },

    {
        id: "appointments",
        label: "Appointments",
        url: "appointments.html",
        icon: "calendar",
        requiresAuth: true
    },

    {
        id: "prescriptions",
        label: "Prescriptions",
        url: "prescriptions.html",
        icon: "file-medical",
        requiresAuth: true
    },

    {
        id: "reminders",
        label: "Medicine Reminders",
        url: "reminders.html",
        icon: "bell",
        requiresAuth: true
    },

    {
        id: "dashboard",
        label: "Dashboard",
        url: "dashboard.html",
        icon: "dashboard",
        requiresAuth: true
    },

    {
        id: "contact",
        label: "Contact",
        url: "contact.html",
        icon: "phone",
        requiresAuth: false
    }

];


/*
=========================================================
3. DEPARTMENT DATA
=========================================================
*/

const DEPARTMENTS = [

    {
        id: "general-medicine",

        name:
            "General Medicine",

        shortName:
            "General Medicine",

        description:
            "Primary healthcare, diagnosis and management of common medical conditions.",

        icon:
            "fa-solid fa-stethoscope",

        color:
            "blue",

        active:
            true
    },


    {
        id: "cardiology",

        name:
            "Cardiology",

        shortName:
            "Cardiology",

        description:
            "Healthcare services related to the heart and cardiovascular system.",

        icon:
            "fa-solid fa-heart-pulse",

        color:
            "red",

        active:
            true
    },


    {
        id: "neurology",

        name:
            "Neurology",

        shortName:
            "Neurology",

        description:
            "Medical care involving the nervous system.",

        icon:
            "fa-solid fa-brain",

        color:
            "purple",

        active:
            true
    },


    {
        id: "dermatology",

        name:
            "Dermatology",

        shortName:
            "Dermatology",

        description:
            "Diagnosis and treatment of skin, hair and nail conditions.",

        icon:
            "fa-solid fa-hand-dots",

        color:
            "orange",

        active:
            true
    },


    {
        id: "pediatrics",

        name:
            "Pediatrics",

        shortName:
            "Pediatrics",

        description:
            "Healthcare services for infants, children and adolescents.",

        icon:
            "fa-solid fa-child",

        color:
            "green",

        active:
            true
    },


    {
        id: "orthopedics",

        name:
            "Orthopedics",

        shortName:
            "Orthopedics",

        description:
            "Healthcare related to bones, joints and the musculoskeletal system.",

        icon:
            "fa-solid fa-bone",

        color:
            "yellow",

        active:
            true
    },


    {
        id: "gynecology",

        name:
            "Gynecology",

        shortName:
            "Gynecology",

        description:
            "Healthcare services related to women's reproductive health.",

        icon:
            "fa-solid fa-person",

        color:
            "pink",

        active:
            true
    },


    {
        id: "ophthalmology",

        name:
            "Ophthalmology",

        shortName:
            "Eye Care",

        description:
            "Medical care for eye and vision-related conditions.",

        icon:
            "fa-solid fa-eye",

        color:
            "cyan",

        active:
            true
    }

];


/*
=========================================================
4. SERVICES
=========================================================
*/

const SERVICES = [

    {
        id: "doctor-consultation",

        title:
            "Doctor Consultation",

        description:
            "Book an appointment with a healthcare professional.",

        icon:
            "fa-solid fa-user-doctor",

        requiresAuth:
            true
    },


    {
        id: "medicine-reminder",

        title:
            "Medicine Reminders",

        description:
            "Create and manage reminders for prescribed medicines.",

        icon:
            "fa-solid fa-pills",

        requiresAuth:
            true
    },


    {
        id: "prescription-management",

        title:
            "Prescription Management",

        description:
            "Keep your prescription information organized in one place.",

        icon:
            "fa-solid fa-file-prescription",

        requiresAuth:
            true
    },


    {
        id: "appointment-management",

        title:
            "Appointment Management",

        description:
            "View, schedule, update and manage appointments.",

        icon:
            "fa-solid fa-calendar-check",

        requiresAuth:
            true
    },


    {
        id: "health-dashboard",

        title:
            "Health Dashboard",

        description:
            "View appointments, prescriptions and medicine reminders.",

        icon:
            "fa-solid fa-chart-line",

        requiresAuth:
            true
    },


    {
        id: "emergency",

        title:
            "Emergency Assistance",

        description:
            "Quick access to emergency contact information.",

        icon:
            "fa-solid fa-truck-medical",

        requiresAuth:
            false
    }

];


/*
=========================================================
5. DOCTORS
=========================================================

This is DEMO frontend data.

For a real application, doctors should eventually be
loaded from your backend/database rather than permanently
stored here.
=========================================================
*/

const DOCTORS = [

    {
        id:
            "doctor-001",

        name:
            "Dr. Aarav Sharma",

        specialization:
            "General Physician",

        department:
            "general-medicine",

        qualification:
            "MBBS, MD",

        experience:
            10,

        consultationFee:
            500,

        rating:
            4.8,

        reviews:
            126,

        gender:
            "male",

        availability:
            "Mon - Sat",

        consultationMode: [
            "in-person",
            "online"
        ],

        image:
            "assets/images/doctors/doctor-1.jpg",

        bio:
            "Provides general medical consultation and preventive healthcare services.",

        languages: [
            "English",
            "Hindi"
        ],

        active:
            true
    },


    {
        id:
            "doctor-002",

        name:
            "Dr. Ananya Mehta",

        specialization:
            "Cardiologist",

        department:
            "cardiology",

        qualification:
            "MBBS, MD, DM Cardiology",

        experience:
            12,

        consultationFee:
            1000,

        rating:
            4.9,

        reviews:
            214,

        gender:
            "female",

        availability:
            "Mon - Fri",

        consultationMode: [
            "in-person",
            "online"
        ],

        image:
            "assets/images/doctors/doctor-2.jpg",

        bio:
            "Provides cardiovascular consultations and heart-health management.",

        languages: [
            "English",
            "Hindi"
        ],

        active:
            true
    },


    {
        id:
            "doctor-003",

        name:
            "Dr. Rohan Verma",

        specialization:
            "Orthopedic Specialist",

        department:
            "orthopedics",

        qualification:
            "MBBS, MS Orthopedics",

        experience:
            9,

        consultationFee:
            800,

        rating:
            4.7,

        reviews:
            158,

        gender:
            "male",

        availability:
            "Mon - Sat",

        consultationMode: [
            "in-person"
        ],

        image:
            "assets/images/doctors/doctor-3.jpg",

        bio:
            "Provides orthopedic consultation for musculoskeletal conditions.",

        languages: [
            "English",
            "Hindi"
        ],

        active:
            true
    },


    {
        id:
            "doctor-004",

        name:
            "Dr. Priya Kapoor",

        specialization:
            "Dermatologist",

        department:
            "dermatology",

        qualification:
            "MBBS, MD Dermatology",

        experience:
            8,

        consultationFee:
            700,

        rating:
            4.8,

        reviews:
            174,

        gender:
            "female",

        availability:
            "Mon - Fri",

        consultationMode: [
            "in-person",
            "online"
        ],

        image:
            "assets/images/doctors/doctor-4.jpg",

        bio:
            "Provides dermatological consultations and skin-health care.",

        languages: [
            "English",
            "Hindi"
        ],

        active:
            true
    },


    {
        id:
            "doctor-005",

        name:
            "Dr. Kabir Singh",

        specialization:
            "Neurologist",

        department:
            "neurology",

        qualification:
            "MBBS, MD, DM Neurology",

        experience:
            14,

        consultationFee:
            1200,

        rating:
            4.9,

        reviews:
            190,

        gender:
            "male",

        availability:
            "Mon - Fri",

        consultationMode: [
            "in-person",
            "online"
        ],

        image:
            "assets/images/doctors/doctor-5.jpg",

        bio:
            "Provides neurological consultation and management.",

        languages: [
            "English",
            "Hindi"
        ],

        active:
            true
    }

];


/*
=========================================================
6. MEDICINE FORMS
=========================================================
*/

const MEDICINE_FORMS = [

    {
        value: "tablet",
        label: "Tablet"
    },

    {
        value: "capsule",
        label: "Capsule"
    },

    {
        value: "syrup",
        label: "Syrup"
    },

    {
        value: "injection",
        label: "Injection"
    },

    {
        value: "cream",
        label: "Cream"
    },

    {
        value: "ointment",
        label: "Ointment"
    },

    {
        value: "drops",
        label: "Drops"
    },

    {
        value: "inhaler",
        label: "Inhaler"
    },

    {
        value: "powder",
        label: "Powder"
    },

    {
        value: "other",
        label: "Other"
    }

];


/*
=========================================================
7. MEDICINE FREQUENCIES
=========================================================
*/

const MEDICINE_FREQUENCIES = [

    {
        value:
            "once-daily",

        label:
            "Once daily",

        dosesPerDay:
            1
    },


    {
        value:
            "twice-daily",

        label:
            "Twice daily",

        dosesPerDay:
            2
    },


    {
        value:
            "three-times-daily",

        label:
            "Three times daily",

        dosesPerDay:
            3
    },


    {
        value:
            "four-times-daily",

        label:
            "Four times daily",

        dosesPerDay:
            4
    },


    {
        value:
            "as-needed",

        label:
            "As needed",

        dosesPerDay:
            null
    },


    {
        value:
            "weekly",

        label:
            "Weekly",

        dosesPerDay:
            null
    },


    {
        value:
            "custom",

        label:
            "Custom",

        dosesPerDay:
            null
    }

];


/*
=========================================================
8. MEAL INSTRUCTIONS
=========================================================
*/

const MEAL_INSTRUCTIONS = [

    {
        value:
            "before-food",

        label:
            "Before food"
    },


    {
        value:
            "after-food",

        label:
            "After food"
    },


    {
        value:
            "with-food",

        label:
            "With food"
    },


    {
        value:
            "empty-stomach",

        label:
            "Empty stomach"
    },


    {
        value:
            "anytime",

        label:
            "Anytime"
    }

];


/*
=========================================================
9. APPOINTMENT STATUS
=========================================================
*/

const APPOINTMENT_STATUSES = [

    {
        value:
            "pending",

        label:
            "Pending"
    },


    {
        value:
            "confirmed",

        label:
            "Confirmed"
    },


    {
        value:
            "completed",

        label:
            "Completed"
    },


    {
        value:
            "cancelled",

        label:
            "Cancelled"
    },


    {
        value:
            "no-show",

        label:
            "No Show"
    }

];


/*
=========================================================
10. APPOINTMENT MODES
=========================================================
*/

const APPOINTMENT_MODES = [

    {
        value:
            "in-person",

        label:
            "In Person",

        icon:
            "fa-solid fa-hospital"
    },


    {
        value:
            "online",

        label:
            "Online Consultation",

        icon:
            "fa-solid fa-video"
    }

];


/*
=========================================================
11. REMINDER NOTIFICATION OPTIONS
=========================================================
*/

const NOTIFICATION_OPTIONS = [

    {
        value: 0,

        label:
            "At scheduled time"
    },


    {
        value: 5,

        label:
            "5 minutes before"
    },


    {
        value: 10,

        label:
            "10 minutes before"
    },


    {
        value: 15,

        label:
            "15 minutes before"
    },


    {
        value: 30,

        label:
            "30 minutes before"
    },


    {
        value: 60,

        label:
            "1 hour before"
    }

];


/*
=========================================================
12. FAQ DATA
=========================================================
*/

const FAQ_DATA = [

    {
        id:
            1,

        question:
            "How can I book an appointment?",

        answer:
            "Create or log in to your MedCare account, open the appointments section, select a doctor and choose an available date and time."
    },


    {
        id:
            2,

        question:
            "Can I manage my prescriptions?",

        answer:
            "Yes. Authenticated users can view and manage prescription information associated with their MedCare account."
    },


    {
        id:
            3,

        question:
            "How do medicine reminders work?",

        answer:
            "You can create a reminder by entering the medicine name, dosage, frequency and reminder times. The reminder can then be displayed in your MedCare dashboard."
    },


    {
        id:
            4,

        question:
            "Can I cancel an appointment?",

        answer:
            "Appointments can be cancelled through the appointment management section, subject to the rules configured by the healthcare service."
    },


    {
        id:
            5,

        question:
            "Can I access MedCare from my phone?",

        answer:
            "The MedCare frontend can be designed responsively so that the main features are accessible from desktop and mobile devices."
    },


    {
        id:
            6,

        question:
            "Is my medical information private?",

        answer:
            "Medical information should be protected using authentication, authorization, secure storage and appropriate security practices. Do not expose private healthcare information in frontend source code."
    }

];


/*
=========================================================
13. EMERGENCY INFORMATION
=========================================================

IMPORTANT:

These are generic emergency numbers.

The application should clearly tell users to contact
their local emergency service when appropriate.
=========================================================
*/

const EMERGENCY_DATA = {

    emergencyNumber:
        "112",

    ambulanceNumber:
        "108",

    policeNumber:
        "100",

    fireNumber:
        "101",

    message:
        "For a medical emergency, contact your local emergency service or seek immediate medical attention."

};


/*
=========================================================
14. DASHBOARD DEFAULT DATA
=========================================================

These are DEFAULT values used while the backend data is
being loaded.

They should eventually be replaced with actual values
returned by your API.
=========================================================
*/

const DEFAULT_DASHBOARD_DATA = {

    appointments: {

        total:
            0,

        upcoming:
            0,

        completed:
            0,

        cancelled:
            0

    },


    prescriptions: {

        total:
            0,

        active:
            0,

        completed:
            0,

        expired:
            0

    },


    reminders: {

        total:
            0,

        active:
            0,

        completedToday:
            0,

        missedToday:
            0

    }

};


/*
=========================================================
15. USER ROLES
=========================================================
*/

const USER_ROLES = [

    {
        value:
            "patient",

        label:
            "Patient"
    },


    {
        value:
            "doctor",

        label:
            "Doctor"
    },


    {
        value:
            "admin",

        label:
            "Administrator"
    }

];


/*
=========================================================
16. GENDER OPTIONS
=========================================================
*/

const GENDER_OPTIONS = [

    {
        value:
            "male",

        label:
            "Male"
    },


    {
        value:
            "female",

        label:
            "Female"
    },


    {
        value:
            "other",

        label:
            "Other"
    },


    {
        value:
            "prefer-not-to-say",

        label:
            "Prefer not to say"
    }

];


/*
=========================================================
17. DAYS OF WEEK
=========================================================
*/

const DAYS_OF_WEEK = [

    {
        value:
            0,

        label:
            "Sunday",

        short:
            "Sun"
    },


    {
        value:
            1,

        label:
            "Monday",

        short:
            "Mon"
    },


    {
        value:
            2,

        label:
            "Tuesday",

        short:
            "Tue"
    },


    {
        value:
            3,

        label:
            "Wednesday",

        short:
            "Wed"
    },


    {
        value:
            4,

        label:
            "Thursday",

        short:
            "Thu"
    },


    {
        value:
            5,

        label:
            "Friday",

        short:
            "Fri"
    },


    {
        value:
            6,

        label:
            "Saturday",

        short:
            "Sat"
    }

];


/*
=========================================================
18. HELPER FUNCTION
=========================================================

Find doctor by ID.
=========================================================
*/

function getDoctorById(
    doctorId
) {

    return DOCTORS.find(
        doctor =>
            doctor.id === doctorId
    );

}


/*
=========================================================
19. HELPER FUNCTION
=========================================================

Find department by ID.
=========================================================
*/

function getDepartmentById(
    departmentId
) {

    return DEPARTMENTS.find(
        department =>
            department.id ===
            departmentId
    );

}


/*
=========================================================
20. HELPER FUNCTION
=========================================================

Find doctors by department.
=========================================================
*/

function getDoctorsByDepartment(
    departmentId
) {

    return DOCTORS.filter(
        doctor =>
            doctor.department ===
            departmentId &&
            doctor.active === true
    );

}


/*
=========================================================
21. HELPER FUNCTION
=========================================================

Search doctors.

Searches:

- Name
- Specialization
- Department
=========================================================
*/

function searchDoctors(
    searchTerm
) {

    if (
        !searchTerm
    ) {

        return DOCTORS;

    }


    const term =
        searchTerm
            .trim()
            .toLowerCase();


    return DOCTORS.filter(
        doctor => {

            return (

                doctor.name
                    .toLowerCase()
                    .includes(term)

                ||

                doctor.specialization
                    .toLowerCase()
                    .includes(term)

                ||

                doctor.department
                    .toLowerCase()
                    .includes(term)

            );

        }
    );

}


/*
=========================================================
22. FORMAT CURRENCY
=========================================================
*/

function formatCurrency(
    amount
) {

    const numericAmount =
        Number(amount);


    if (
        Number.isNaN(
            numericAmount
        )
    ) {

        return "₹0";

    }


    return new Intl.NumberFormat(
        "en-IN",
        {

            style:
                "currency",

            currency:
                MEDCARE_CONFIG.currency,

            maximumFractionDigits:
                0

        }
    ).format(
        numericAmount
    );

}


/*
=========================================================
23. FORMAT DATE
=========================================================
*/

function formatDate(
    date
) {

    if (
        !date
    ) {

        return "";

    }


    const parsedDate =
        new Date(date);


    if (
        Number.isNaN(
            parsedDate.getTime()
        )
    ) {

        return "";

    }


    return parsedDate.toLocaleDateString(
        "en-IN",
        {

            day:
                "2-digit",

            month:
                "short",

            year:
                "numeric"

        }
    );

}


/*
=========================================================
24. FORMAT TIME
=========================================================
*/

function formatTime(
    time
) {

    if (
        !time
    ) {

        return "";

    }


    /*
    If already HH:MM,
    return it directly.
    */

    if (
        /^\d{2}:\d{2}$/
            .test(time)
    ) {

        const [
            hours,
            minutes
        ] =
            time.split(":")
                .map(Number);


        const date =
            new Date();


        date.setHours(
            hours,
            minutes,
            0,
            0
        );


        return date.toLocaleTimeString(
            "en-IN",
            {

                hour:
                    "2-digit",

                minute:
                    "2-digit",

                hour12:
                    true

            }
        );

    }


    const date =
        new Date(time);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return time;

    }


    return date.toLocaleTimeString(
        "en-IN",
        {

            hour:
                "2-digit",

            minute:
                "2-digit",

            hour12:
                true

        }
    );

}


/*
=========================================================
25. FORMAT FREQUENCY
=========================================================
*/

function formatFrequency(
    frequency
) {

    const frequencyObject =
        MEDICINE_FREQUENCIES.find(

            item =>
                item.value ===
                frequency

        );


    return frequencyObject
        ? frequencyObject.label
        : frequency || "";

}


/*
=========================================================
26. FORMAT MEAL INSTRUCTION
=========================================================
*/

function formatMealInstruction(
    instruction
) {

    const meal =
        MEAL_INSTRUCTIONS.find(

            item =>
                item.value ===
                instruction

        );


    return meal
        ? meal.label
        : instruction || "";

}


/*
=========================================================
27. GET APPOINTMENT STATUS LABEL
=========================================================
*/

function getAppointmentStatusLabel(
    status
) {

    const item =
        APPOINTMENT_STATUSES.find(

            statusItem =>
                statusItem.value ===
                status

        );


    return item
        ? item.label
        : status || "";

}


/*
=========================================================
28. GET ACTIVE DOCTORS
=========================================================
*/

function getActiveDoctors() {

    return DOCTORS.filter(
        doctor =>
            doctor.active === true
    );

}


/*
=========================================================
29. GET ACTIVE DEPARTMENTS
=========================================================
*/

function getActiveDepartments() {

    return DEPARTMENTS.filter(
        department =>
            department.active === true
    );

}


/*
=========================================================
30. CREATE EMPTY APPOINTMENT OBJECT
=========================================================

Useful for appointment forms.
=========================================================
*/

function createEmptyAppointment() {

    return {

        doctorId:
            "",

        departmentId:
            "",

        appointmentDate:
            "",

        appointmentTime:
            "",

        consultationMode:
            "in-person",

        reason:
            "",

        notes:
            ""

    };

}


/*
=========================================================
31. CREATE EMPTY REMINDER OBJECT
=========================================================

Matches the Reminder.js model.
=========================================================
*/

function createEmptyReminder() {

    return {

        medicineName:
            "",

        genericName:
            "",

        brandName:
            "",

        dosage:
            "",

        medicineForm:
            "tablet",

        frequency:
            "once-daily",

        reminderTimes: [

            {
                time:
                    "08:00",

                enabled:
                    true

            }

        ],

        startDate:
            "",

        endDate:
            "",

        active:
            true,

        mealInstruction:
            "anytime",

        doctorName:
            "",

        doctorContact:
            "",

        quantity:
            null,

        quantityUnit:
            "",

        refillReminderEnabled:
            false,

        refillThreshold:
            null,

        notificationEnabled:
            true,

        notificationMinutesBefore:
            0,

        notes:
            ""

    };

}


/*
=========================================================
32. CREATE EMPTY PRESCRIPTION OBJECT
=========================================================

Matches the Prescription.js model.
=========================================================
*/

function createEmptyPrescription() {

    return {

        title:
            "",

        doctorName:
            "",

        doctorSpecialization:
            "",

        doctorContact:
            "",

        clinicName:
            "",

        clinicAddress:
            "",

        prescriptionDate:
            "",

        validUntil:
            "",

        diagnosis:
            "",

        reason:
            "",

        medicines: [],

        instructions:
            "",

        followUpDate:
            "",

        followUpNotes:
            "",

        refillAllowed:
            false,

        maximumRefills:
            0,

        notes:
            ""

    };

}


/*
=========================================================
33. MEDICINE OBJECT CREATOR
=========================================================
*/

function createMedicine() {

    return {

        medicineName:
            "",

        genericName:
            "",

        dosage:
            "",

        medicineForm:
            "tablet",

        frequency:
            "once-daily",

        times: [

            "08:00"

        ],

        duration:
            null,

        durationUnit:
            "days",

        startDate:
            "",

        endDate:
            "",

        mealInstruction:
            "anytime",

        quantity:
            null,

        quantityUnit:
            "",

        instructions:
            ""

    };

}


/*
=========================================================
34. APPOINTMENT TIME SLOTS
=========================================================

Generates basic appointment slots for the frontend.

The backend must still verify actual availability.
=========================================================
*/

function generateTimeSlots(
    startHour = 9,
    endHour = 18,
    intervalMinutes = 30
) {

    const slots = [];


    let currentMinutes =
        startHour * 60;


    const endMinutes =
        endHour * 60;


    while (
        currentMinutes <
        endMinutes
    ) {

        const hours =
            Math.floor(
                currentMinutes / 60
            );


        const minutes =
            currentMinutes % 60;


        const formattedHours =
            String(hours)
                .padStart(
                    2,
                    "0"
                );


        const formattedMinutes =
            String(minutes)
                .padStart(
                    2,
                    "0"
                );


        slots.push({

            value:
                `${formattedHours}:${formattedMinutes}`,

            label:
                formatTime(
                    `${formattedHours}:${formattedMinutes}`
                )

        });


        currentMinutes +=
            intervalMinutes;

    }


    return slots;

}


/*
=========================================================
35. PASSWORD REQUIREMENTS
=========================================================
*/

const PASSWORD_REQUIREMENTS = {

    minimumLength:
        8,

    requiresUppercase:
        true,

    requiresLowercase:
        true,

    requiresNumber:
        true

};


/*
=========================================================
36. VALIDATE PASSWORD
=========================================================
*/

function validatePassword(
    password
) {

    const errors = [];


    if (
        typeof password !==
        "string"
    ) {

        return [
            "Password is required."
        ];

    }


    if (
        password.length <
        PASSWORD_REQUIREMENTS.minimumLength
    ) {

        errors.push(
            "Password must contain at least 8 characters."
        );

    }


    if (
        PASSWORD_REQUIREMENTS.requiresUppercase &&
        !/[A-Z]/.test(password)
    ) {

        errors.push(
            "Password must contain an uppercase letter."
        );

    }


    if (
        PASSWORD_REQUIREMENTS.requiresLowercase &&
        !/[a-z]/.test(password)
    ) {

        errors.push(
            "Password must contain a lowercase letter."
        );

    }


    if (
        PASSWORD_REQUIREMENTS.requiresNumber &&
        !/[0-9]/.test(password)
    ) {

        errors.push(
            "Password must contain a number."
        );

    }


    return errors;

}


/*
=========================================================
37. VALIDATE EMAIL
=========================================================
*/

function validateEmail(
    email
) {

    if (
        typeof email !==
        "string"
    ) {

        return false;

    }


    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(
            email.trim()
        );

}


/*
=========================================================
38. GET API URL
=========================================================

Useful when calling backend endpoints.
=========================================================
*/

function getApiUrl(
    endpoint
) {

    const base =
        MEDCARE_CONFIG.apiBaseUrl
            .replace(
                /\/$/,
                ""
            );


    const path =
        endpoint
            .replace(
                /^\//,
                ""
            );


    return `${base}/${path}`;

}


/*
=========================================================
39. AUTH STORAGE HELPERS
=========================================================
*/

function saveAuthData(
    token,
    user
) {

    if (
        token
    ) {

        localStorage.setItem(

            MEDCARE_CONFIG
                .storageKeys
                .token,

            token

        );

    }


    if (
        user
    ) {

        localStorage.setItem(

            MEDCARE_CONFIG
                .storageKeys
                .user,

            JSON.stringify(
                user
            )

        );

    }

}


/*
=========================================================
40. GET AUTH TOKEN
=========================================================
*/

function getAuthToken() {

    return localStorage.getItem(

        MEDCARE_CONFIG
            .storageKeys
            .token

    );

}


/*
=========================================================
41. GET STORED USER
=========================================================
*/

function getStoredUser() {

    const user =
        localStorage.getItem(

            MEDCARE_CONFIG
                .storageKeys
                .user

        );


    if (
        !user
    ) {

        return null;

    }


    try {

        return JSON.parse(
            user
        );

    }

    catch (
        error
    ) {

        console.error(
            "Unable to parse stored user:",
            error
        );


        return null;

    }

}


/*
=========================================================
42. CLEAR AUTH DATA
=========================================================
*/

function clearAuthData() {

    localStorage.removeItem(

        MEDCARE_CONFIG
            .storageKeys
            .token

    );


    localStorage.removeItem(

        MEDCARE_CONFIG
            .storageKeys
            .user

    );

}


/*
=========================================================
43. CHECK LOGIN STATUS
=========================================================
*/

function isLoggedIn() {

    return Boolean(
        getAuthToken()
    );

}


/*
=========================================================
44. API REQUEST HELPER
=========================================================

This is a general-purpose frontend function for calling
your Express backend.

Example:

apiRequest(
    "/auth/me"
)

Example:

apiRequest(
    "/appointments",
    {
        method: "POST",
        body: JSON.stringify(data)
    }
)

=========================================================
*/

async function apiRequest(
    endpoint,
    options = {}
) {

    const url =
        getApiUrl(
            endpoint
        );


    const token =
        getAuthToken();


    const headers = {

        "Content-Type":
            "application/json",

        ...(options.headers || {})

    };


    /*
    Add JWT if the user is logged in.
    */

    if (
        token
    ) {

        headers.Authorization =
            `Bearer ${token}`;

    }


    const requestOptions = {

        ...options,

        headers

    };


    try {

        const response =
            await fetch(
                url,
                requestOptions
            );


        /*
        Try to parse JSON response.
        */

        let data;


        try {

            data =
                await response.json();

        }

        catch (
            jsonError
        ) {

            data = {};

        }


        /*
        ---------------------------------------------
        HANDLE UNAUTHORIZED
        ---------------------------------------------
        */

        if (
            response.status === 401
        ) {

            clearAuthData();

        }


        /*
        ---------------------------------------------
        HANDLE HTTP ERRORS
        ---------------------------------------------
        */

        if (
            !response.ok
        ) {

            const error =
                new Error(

                    data.message ||
                    "Request failed."

                );


            error.status =
                response.status;


            error.data =
                data;


            throw error;

        }


        return data;

    }

    catch (
        error
    ) {

        console.error(
            "API request failed:",
            error
        );


        throw error;

    }

}


/*
=========================================================
45. EXPORT / GLOBAL AVAILABILITY
=========================================================

If your project uses regular browser <script> tags,
these values are attached to window so other JS files
can use them.

If you later migrate to ES modules, replace this with
export statements.
=========================================================
*/

window.MEDCARE_CONFIG =
    MEDCARE_CONFIG;

window.NAVIGATION_ITEMS =
    NAVIGATION_ITEMS;

window.DEPARTMENTS =
    DEPARTMENTS;

window.SERVICES =
    SERVICES;

window.DOCTORS =
    DOCTORS;

window.MEDICINE_FORMS =
    MEDICINE_FORMS;

window.MEDICINE_FREQUENCIES =
    MEDICINE_FREQUENCIES;

window.MEAL_INSTRUCTIONS =
    MEAL_INSTRUCTIONS;

window.APPOINTMENT_STATUSES =
    APPOINTMENT_STATUSES;

window.APPOINTMENT_MODES =
    APPOINTMENT_MODES;

window.NOTIFICATION_OPTIONS =
    NOTIFICATION_OPTIONS;

window.FAQ_DATA =
    FAQ_DATA;

window.EMERGENCY_DATA =
    EMERGENCY_DATA;

window.DEFAULT_DASHBOARD_DATA =
    DEFAULT_DASHBOARD_DATA;

window.USER_ROLES =
    USER_ROLES;

window.GENDER_OPTIONS =
    GENDER_OPTIONS;

window.DAYS_OF_WEEK =
    DAYS_OF_WEEK;

window.PASSWORD_REQUIREMENTS =
    PASSWORD_REQUIREMENTS;

window.getDoctorById =
    getDoctorById;

window.getDepartmentById =
    getDepartmentById;

window.getDoctorsByDepartment =
    getDoctorsByDepartment;

window.searchDoctors =
    searchDoctors;

window.formatCurrency =
    formatCurrency;

window.formatDate =
    formatDate;

window.formatTime =
    formatTime;

window.formatFrequency =
    formatFrequency;

window.formatMealInstruction =
    formatMealInstruction;

window.getAppointmentStatusLabel =
    getAppointmentStatusLabel;

window.getActiveDoctors =
    getActiveDoctors;

window.getActiveDepartments =
    getActiveDepartments;

window.createEmptyAppointment =
    createEmptyAppointment;

window.createEmptyReminder =
    createEmptyReminder;

window.createEmptyPrescription =
    createEmptyPrescription;

window.createMedicine =
    createMedicine;

window.generateTimeSlots =
    generateTimeSlots;

window.validatePassword =
    validatePassword;

window.validateEmail =
    validateEmail;

window.getApiUrl =
    getApiUrl;

window.saveAuthData =
    saveAuthData;

window.getAuthToken =
    getAuthToken;

window.getStoredUser =
    getStoredUser;

window.clearAuthData =
    clearAuthData;

window.isLoggedIn =
    isLoggedIn;

window.apiRequest =
    apiRequest;


/*
=========================================================
END OF DATA.JS
=========================================================
*/
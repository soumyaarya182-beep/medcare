require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./routes/auth");
const dataRoutes = require("./routes/data");
const aiRoutes = require("./routes/ai");

const app = express();

const PORT = process.env.PORT || 5000;


/* =====================================================
   MIDDLEWARE
===================================================== */

app.use(helmet());

app.use(
    cors({
        origin:
            process.env.CLIENT_URL ||
            "http://localhost:5500",

        methods: [
            "GET",
            "POST",
            "PUT",
            "DELETE",
            "OPTIONS"
        ],

        allowedHeaders: [
            "Content-Type",
            "Authorization"
        ]
    })
);

app.use(
    express.json({
        limit: "1mb"
    })
);


/* =====================================================
   RATE LIMITING
===================================================== */

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,

    standardHeaders: true,
    legacyHeaders: false,

    message: {
        message:
            "Too many requests. Please try again later."
    }
});

app.use(limiter);


/* =====================================================
   HOME / TEST ROUTE
===================================================== */

app.get("/", (req, res) => {

    res.json({
        message: "MEDCARE API is running",
        status: "success"
    });

});


/* =====================================================
   HEALTH CHECK
===================================================== */

app.get("/api/health", (req, res) => {

    res.json({
        status: "ok",

        database:
            mongoose.connection.readyState === 1
                ? "connected"
                : "disconnected"
    });

});


/* =====================================================
   API ROUTES
===================================================== */

/*
   Authentication

   POST /api/auth/register
   POST /api/auth/login
   GET  /api/auth/me
*/

app.use(
    "/api/auth",
    authRoutes
);


/*
   Healthcare data

   GET    /api/dashboard

   GET    /api/appointments
   POST   /api/appointments
   PUT    /api/appointments/:id
   DELETE /api/appointments/:id

   GET    /api/reminders
   POST   /api/reminders
   PUT    /api/reminders/:id
   DELETE /api/reminders/:id

   GET    /api/prescriptions
   POST   /api/prescriptions
   PUT    /api/prescriptions/:id
   DELETE /api/prescriptions/:id
*/

app.use(
    "/api",
    dataRoutes
);


/*
   Meera AI

   POST /api/ai/chat
*/

app.use(
    "/api/ai",
    aiRoutes
);


/* =====================================================
   404 HANDLER
===================================================== */

app.use(
    (req, res) => {

        res.status(404).json({
            message:
                "API endpoint not found."
        });

    }
);


/* =====================================================
   ERROR HANDLER
===================================================== */

app.use(
    (err, req, res, next) => {

        console.error(
            "Server Error:",
            err
        );

        res.status(500).json({
            message:
                "Internal server error."
        });

    }
);


/* =====================================================
   DATABASE + SERVER START
===================================================== */

async function startServer() {

    try {

        /*
           Check required environment variables
        */

        if (!process.env.MONGO_URI) {

            throw new Error(
                "MONGO_URI is missing in .env"
            );

        }


        if (!process.env.JWT_SECRET) {

            throw new Error(
                "JWT_SECRET is missing in .env"
            );

        }


        /*
           Connect MongoDB
        */

        await mongoose.connect(
            process.env.MONGO_URI
        );


        console.log(
            "✓ MongoDB connected successfully"
        );


        /*
           Start Express server
        */

        app.listen(
            PORT,
            () => {

                console.log(
                    `✓ MEDCARE API running on http://localhost:${PORT}`
                );

            }
        );

    } catch (error) {

        console.error(
            "✗ Server startup failed:"
        );

        console.error(
            error.message
        );

        process.exit(1);
    }
}


/* =====================================================
   START
===================================================== */

startServer();
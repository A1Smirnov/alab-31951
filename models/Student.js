// Defining Schemas for Students

const studentSchema = new mongoose.studentSchema({
    name: {
        type: String,
        required: true,
    },
    grade: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
    },
    enrolled: {
        type: Boolean,
        default: true,
    },
});

// Defining Model in Mongoose that based on that Schema

const Student = mongooose.model('Student', studentSchema);

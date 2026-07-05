import mongoose from "mongoose";

const surveySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Survey title is required"],
      trim: true,
      maxlength: 100,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    questions: [
      {
        questionText: {
          type: String,
          required: true,
          trim: true,
        },

        questionType: {
          type: String,
          enum: ["text", "multiple-choice"],
          required: true,
        },

        options: [
          {
            type: String,
            trim: true,
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Survey = mongoose.model("Survey", surveySchema);

export default Survey;
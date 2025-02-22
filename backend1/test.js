const mongoose = require('mongoose');

// Directly using your provided connection string and specifying the DB name "wings"
const MONGO_URL = "mongodb+srv://admin:hackathon@wingshack.scntw.mongodb.net/wings?retryWrites=true&w=majority";

mongoose.connect(MONGO_URL, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('MongoDB connected');
    insertJobs();
  })
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Define the Job schema
const jobSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  role: { type: String, required: true },
  deadline: { type: String },
  experience: { type: Number },
  requirements: { type: String },
  description: { type: String }
});

// Create the model and explicitly map it to the "jobs" collection
const Jobs = mongoose.model('Jobs', jobSchema, "jobs");

async function insertJobs() {
  const jobsData = [
    {
      id: 1,
      role: "Full Stack Developer",
      deadline: "2025-03-15",
      experience: 3,
      requirements: "Proficient in both frontend and backend technologies.",
      description: "Develop and maintain full stack web applications."
    },
    {
      id: 2,
      role: "UI Designer",
      deadline: "2025-03-20",
      experience: 2,
      requirements: "Expertise in design tools such as Figma, Sketch, or Adobe XD.",
      description: "Design intuitive user interfaces for web and mobile applications."
    },
    {
      id: 3,
      role: "Data Scientist",
      deadline: "2025-03-25",
      experience: 4,
      requirements: "Strong background in statistics, machine learning, and data analysis.",
      description: "Analyze large datasets to derive actionable insights."
    },
    {
      id: 4,
      role: "AI Engineer",
      deadline: "2025-03-30",
      experience: 5,
      requirements: "Experience in building neural networks and AI models from scratch.",
      description: "Design and implement AI models for various applications."
    },
    {
      id: 5,
      role: "Backend Developer",
      deadline: "2025-04-05",
      experience: 3,
      requirements: "Expertise in server-side languages and database management.",
      description: "Build and optimize backend systems."
    }
  ];

  try {
    const result = await Jobs.insertMany(jobsData);
    console.log("Jobs inserted successfully:", result);
  } catch (err) {
    console.error("Error inserting jobs data:", err);
  } finally {
    mongoose.connection.close();
  }
}

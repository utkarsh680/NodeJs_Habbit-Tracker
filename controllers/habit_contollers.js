const Habit = require("../models/habit");

module.exports.SetHabitDetails = async function (req, res) {
  return res.render("user_profile", {
    title: "User Habit",
  });
};

module.exports.create = async function (req, res) {
  try {
    const { title, desc, dateTime } = req.body;

    // Check if title is present
    if (!title) {
      return res.status(400).json({
        message: "title does't exit!",
      });
    }

    const habit = await Habit.create({
      title: title,
      desc: desc,
      user: req.user._id,
      dateTime: dateTime,
    });

    if (!habit) {
      return res.status(400).json({
        message: "Error in creating habit!",
      });
    }
    return res.status(200).json({
      message: "Habit created successfully!",
      habit
    });
  } catch (err) {
    return res.status(400).json({
      message: "Error in creating habit!",
    });
  }
};

module.exports.delete = async function(req, res) {
  const habits_id = req.params.id; // Assuming the habit ID is passed as a parameter in the request
  try {
    // Find the habit by ID
    const habit = await Habit.findByIdAndDelete(habits_id);

    // Check if the habit exists
    if (!habit) {
      return res.redirect('back')
    }

    // Respond with a success message or appropriate response
    req.flash("success", "habit deleted successfully!");
    return res.redirect('back');
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
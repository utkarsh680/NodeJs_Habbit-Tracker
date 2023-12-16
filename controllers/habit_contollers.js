const Habit = require("../models/habit");


module.exports.SetHabitDetails = async function (req, res){
  return res.render('user_profile',{
    title : "User Habit",
  })
}

module.exports.create = async function (req, res) {
  try {
    const { title, desc } = req.body;

    // Check if title is present
    if (!title) {
      console.log('Title is required');
      return res.status(400).send('Title is required'); // You can customize the response as needed
    }

    const habit = await Habit.create({
      title: title,
      desc: desc,
      user: req.user._id,
    });

    if (!habit) {
      console.log('Error in creating a Habit');
      return res.status(500).send('Error in creating a Habit'); // You can customize the response as needed
    }

    return res.redirect('back');
  } catch (err) {
    console.error('Error in creating a habit', err);
    return res.status(500).send('Internal Server Error'); // You can customize the response as needed
  }
};
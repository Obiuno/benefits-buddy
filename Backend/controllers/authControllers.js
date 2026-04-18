import Users from "../models/usersModel.js";

const signup = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await Users.createUser(username, password);
    res.status(201).json({ user });

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await Users.loginUser(username, password);

    res.json({ user });

  } catch (err) {
    res.status(401).json({ error: "Invalid login" });
  }
};

export default { signup, login };
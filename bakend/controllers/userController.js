const users = [
  { id: 1, name: "zaid" },
  { id: 2, name: "zaid2" },
  { id: 3, name: "zaid3" },
];

const getUsers = (req, res, next) => {
  try {
    return res.status(200).json(users);
  } catch (err) {
    return next(err);
  }
};

const getUserDetail = (req, res, next) => {
  try {
    const id = req.params.id;
    if (!id) return res.status(400).json({ message: "id required" });
    const user = users.find((u) => String(u.id) === String(id));
    if (user) {
      return res.status(200).json(user);
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    return next(err);
  }
};

module.exports = { getUserDetail, getUsers };

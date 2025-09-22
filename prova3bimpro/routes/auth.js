const { generateToken, hashPassword, comparePassword } = require("./auth");

app.post("/register", async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const users = await readData();

    if (users.find((u) => u.email === email)) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await hashPassword(password);
    const newUser = {
      id: Date.now().toString(),
      email,
      password: hashedPassword,
      name,
    };

    users.push(newUser);
    await writeData(users);

    const token = generateToken(newUser.id);
    res.status(201).json({ token, user: { id: newUser.id, email, name } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const users = await readData();

    const user = users.find((u) => u.email === email);
    if (!user || !(await comparePassword(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = generateToken(user.id);
    res.json({
      token,
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/profile", authenticateToken, async (req, res) => {
  try {
    const users = await readData();
    const user = users.find((u) => u.id === req.user.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ id: user.id, email: user.email, name: user.name });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

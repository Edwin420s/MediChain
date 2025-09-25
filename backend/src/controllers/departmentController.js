import prisma from '../config/db.js';

export const createDepartment = async (req, res) => {
  try {
    const { name, description } = req.body;

    const department = await prisma.department.create({
      data: {
        name,
        description,
        createdBy: req.user.id
      }
    });

    res.status(201).json(department);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getDepartments = async (req, res) => {
  try {
    const departments = await prisma.department.findMany({
      include: {
        _count: {
          select: { doctors: true }
        }
      }
    });

    res.json(departments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
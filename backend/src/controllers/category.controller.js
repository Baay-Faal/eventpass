const { Category } = require('../models');

// GET /api/categories (Route publique)
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      order: [['name', 'ASC']],
    });
    res.json({ success: true, data: categories });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};

// POST /api/admin/categories (Route Admin)
const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Le nom de la catégorie est requis.' });
    }

    const uppercaseName = name.toUpperCase().trim();

    const existing = await Category.findOne({ where: { name: uppercaseName } });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Cette catégorie existe déjà.' });
    }

    const newCategory = await Category.create({ name: uppercaseName });
    res.status(201).json({ success: true, data: newCategory, message: 'Catégorie créée.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};

// DELETE /api/admin/categories/:id (Route Admin)
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Catégorie introuvable.' });
    }
    
    // Si on veut être strict, on pourrait vérifier s'il n'y a pas d'événements liés.
    // Mais vu que `category` dans `Event` est juste un string, on peut la supprimer de la nomenclature sans casser l'historique.

    await category.destroy();
    res.json({ success: true, message: 'Catégorie supprimée.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};

module.exports = {
  getAllCategories,
  createCategory,
  deleteCategory,
};

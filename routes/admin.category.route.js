import express from 'express';
import categoryService from '../services/category.service.js';
import subCategoryModel from '../utils/models/sub-category.model.js';
import subcategoryService from '../services/subcategory.service.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const categories = JSON.parse(
    JSON.stringify(await categoryService.findAll())
  );

  return res.render('vwAdmin/vwCategory/detail', {
    categories,
  });
});

router.get('/add', (req, res) => {
  return res.render('vwAdmin/vwCategory/add', {});
});

router.post('/add', async (req, res) => {
  const { catTitle } = req.body;

  if (catTitle.length === 0) {
    return res.render('vwAdmin/vwCategory/add', {
      errMessage: 'Please enter category title',
    });
  }

  const newCategory = await categoryService.createCategory(catTitle);

  console.log(newCategory);

  if (newCategory) {
    return res.redirect('/admin/category');
  }

  return res.render('vwAdmin/vwCategory/add', {
    errMessage: 'Entered the existed category title',
  });
});

router.get('/:id', async (req, res) => {
  const catId = req.params.id;
  const sub_categories = JSON.parse(
    JSON.stringify(
      await subCategoryModel.find({ category: catId }).populate('category')
    )
  );

  const category = JSON.parse(
    JSON.stringify(await categoryService.findCategoryById(catId))
  );

  return res.render('vwAdmin/vwSubcategory/detail', {
    sub_categories,
    category,
  });
});

router.get('/add/:id', async (req, res) => {
  const catId = req.params.id;

  const category = JSON.parse(
    JSON.stringify(await categoryService.findCategoryById(catId))
  );

  console.log(category);

  return res.render('vwAdmin/vwSubcategory/add', {
    cateTitle: category,
  });
});

router.post('/add/:id', async (req, res) => {
  const { subcatTitle } = req.body;
  const catId = req.params.id;

  if (subcatTitle.length === 0) {
    const category = JSON.parse(
      JSON.stringify(await categoryService.findCategoryById(catId))
    );

    return res.render('vwAdmin/vwSubcategory/add', {
      cateTitle: category,
      errMessage: 'Please enter the Subcategory title.',
    });
  }

  const subCate = await subcategoryService.findSubcategory(subcatTitle);

  if (subCate) {
    const category = JSON.parse(
      JSON.stringify(await categoryService.findCategoryById(catId))
    );

    return res.render('vwAdmin/vwSubcategory/add', {
      cateTitle: category,
      errMessage: 'Entered Subcategory title is existed',
    });
  }

  subcategoryService.createSubCategory(subcatTitle, catId);

  return res.redirect('/admin/category/' + catId);
});

router.get('/edit/:id', async (req, res) => {
  const catId = req.params.id;

  const category = JSON.parse(
    JSON.stringify(await categoryService.findCategoryById(catId))
  );

  return res.render('vwAdmin/vwCategory/edit', {
    category,
  });
});

router.get('/edit/sub/:subcatID', async (req, res) => {
  const subcatId = req.params.subcatID;

  const subcategory = JSON.parse(
    JSON.stringify(await subcategoryService.findSubcategoryById(subcatId))
  );

  return res.render('vwAdmin/vwSubcategory/edit', {
    subcategory,
  });
});

router.post('/patch', async (req, res) => {
  const { catID, catTitle } = req.body;
  await categoryService.patch(catID, catTitle);
  return res.redirect('/admin/category');
});

router.post('/sub/patch', async (req, res) => {
  const { subcatID, subcatTitle } = req.body;
  const catID = req.query.catID;
  await subcategoryService.patch(subcatID, subcatTitle);
  return res.redirect('/admin/category/' + catID);
});

router.post('/del', async (req, res) => {
  const catID = req.query.catID;
  await subcategoryService.delByCat(catID);
  await categoryService.del(catID);
  return res.redirect('/admin/category');
});

router.post('/sub/del', async (req, res) => {
  const { catID, subcatID } = req.query;
  await subcategoryService.del(subcatID);
  return res.redirect('/admin/category/' + catID);
});

export default router;

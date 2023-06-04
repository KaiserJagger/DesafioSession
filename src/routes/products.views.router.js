import { Router } from "express";
import productModel from "../dao/models/products.model.js";

const router = Router();

// Middleware para verificar la autenticación del usuario
const requireAuth = (req, res, next) => {
  const user = req.session.user;
  if (user) {
    next(); // El usuario está autenticado, permitir el acceso al siguiente middleware o ruta
  } else {
    req.session.redirectToCart = true; // Almacenar en la sesión que se redirigirá al carrito después del inicio de sesión
    res.redirect("/session/login"); // Redirigir al usuario a la página de inicio de sesión
  }
};

router.get("/", requireAuth, async (req, res) => {
  const limit = req.query?.limit || 10;
  const page = req.query?.page || 1;
  const filter = req.query?.filter || "";
  const sortQuery = req.query?.sort || "";
  const sortQueryOrder = req.query?.sortorder || "desc";

  const search = {};
  if (filter) {
    search.title = filter;
  }
  const sort = {};
  if (sortQuery) {
    sort[sortQuery] = sortQueryOrder;
  }

  const options = {
    limit,
    page,
    sort,
    lean: true,
  };

  try {
    const data = await productModel.paginate(search, options);
    const user = req.session.user;

    // Obtener las categorías disponibles desde la base de datos o calcularlas dinámicamente
    const categories = await productModel.distinct("category").lean();

    // Verificar si se debe redirigir al carrito después del inicio de sesión
    const redirectToCart = req.session.redirectToCart;
    delete req.session.redirectToCart; // Eliminar la bandera de redirección del carrito

    res.render("products", { data, user, categories, redirectToCart });
  } catch (error) {
    res.status(500).send("Error retrieving products");
  }
});

export default router;

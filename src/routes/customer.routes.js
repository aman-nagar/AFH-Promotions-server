import { Router } from "express";
import {
  getOrCreateCustomer,
  getCustomerById,
  getAllCustomers,
  deleteCustomer,
  deleteCustomers,
  deleteAllCustomers,
} from "../services/customer.service.js";
import { ApiError } from "../middleware/errorHandler.js";

const router = Router();

/**
 * POST /api/customers
 * Create or get existing customer by mobile
 */
router.post("/", async (req, res, next) => {
  try {
    const { name, mobile, dob } = req.body;

    const customer = await getOrCreateCustomer(name, mobile, dob);

    res.status(200).json({
      success: true,
      data: customer,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/customers/:id
 * Get customer by ID
 */
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const customer = await getCustomerById(id);

    res.status(200).json({
      success: true,
      data: customer,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/customers
 * Get all customers (admin/staff)
 */
router.get("/", async (req, res, next) => {
  try {
    const { limit = 100, skip = 0 } = req.query;
    const result = await getAllCustomers(Number(limit), Number(skip));

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/bulk-delete", async (req, res, next) => {
  try {
    const { customerIds = [] } = req.body || {};
    const customers = await deleteCustomers(customerIds);

    res.status(200).json({
      success: true,
      data: customers,
      message: `${customers.length} customers deleted`,
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/all", async (req, res, next) => {
  try {
    const customers = await deleteAllCustomers();

    res.status(200).json({
      success: true,
      data: customers,
      message: "All customers deleted",
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const customer = await deleteCustomer(id);

    res.status(200).json({
      success: true,
      data: customer,
      message: "Customer deleted successfully",
    });
  } catch (error) {
    next(error);
  }
});

export default router;

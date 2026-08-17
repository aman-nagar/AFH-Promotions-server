import { Customer } from "../models/Customer.js";
import { ApiError } from "../middleware/errorHandler.js";

/**
 * Get or create customer by mobile number
 * If customer with mobile exists, return existing
 * If not, create new customer
 */
export async function getOrCreateCustomer(name, mobile, dob = null) {
  if (!mobile || !/^[6-9]\d{9}$/.test(mobile)) {
    throw new ApiError(400, "Invalid mobile number format", "INVALID_MOBILE");
  }

  let customer = await Customer.findOne({ mobile });

  if (customer) {
    return customer;
  }

  customer = new Customer({
    name: name.trim(),
    mobile: mobile.trim(),
    dob: dob || null,
  });

  await customer.save();
  return customer;
}

/**
 * Get customer by ID
 */
export async function getCustomerById(customerId) {
  const customer = await Customer.findById(customerId);

  if (!customer) {
    throw new ApiError(404, "Customer not found", "CUSTOMER_NOT_FOUND");
  }

  return customer;
}

/**
 * Get all customers (admin/staff only)
 */
export async function getAllCustomers(limit = 100, skip = 0) {
  const customers = await Customer.find()
    .limit(limit)
    .skip(skip)
    .sort({ createdAt: -1 });

  const total = await Customer.countDocuments();

  return {
    customers,
    total,
    limit,
    skip,
  };
}

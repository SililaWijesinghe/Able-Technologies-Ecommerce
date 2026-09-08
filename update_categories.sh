#!/bin/bash

# Fix the imports to include useNavigate
sed -i 's/import { Plus, Edit/import { useNavigate } from "react-router-dom";\nimport { Plus, Edit/' src/pages/admin/Categories.tsx

# Add the navigate hook
sed -i '/export default function Categories() {/a \  const navigate = useNavigate();' src/pages/admin/Categories.tsx

# Fix toast calls
sed -i 's/toast({ title: "Error", description: err.message || "Failed to load data", variant: "danger" });/toast.error(err.message || "Failed to load data");/g' src/pages/admin/Categories.tsx
sed -i 's/toast({ title: "Validation Error", description: "Category name is required.", variant: "danger" });/toast.error("Category name is required.");/g' src/pages/admin/Categories.tsx
sed -i 's/toast({ title: "Success", description: "Category created!", variant: "success" });/toast.success("Category created successfully!");\n      setTimeout(() => navigate("\/admin\/categories"), 1200);/g' src/pages/admin/Categories.tsx
sed -i 's/toast({ title: "Error", description: errorMessage, variant: "danger" });/toast.error(errorMessage || "Failed to update category. Please try again.");/g' src/pages/admin/Categories.tsx
sed -i "s/toast({ title: 'Success', description: 'Category updated!', variant: \"success\" });/toast.success(\"Category updated successfully!\");\n      setTimeout(() => navigate(\"\/admin\/categories\"), 1200);/g" src/pages/admin/Categories.tsx
sed -i 's/toast({ title: "Success", description: "Category deleted!", variant: "success" });/toast.success("Category deleted successfully!");/g' src/pages/admin/Categories.tsx
sed -i 's/toast({ title: "Error", description: err.message || "Failed to delete category", variant: "danger" });/toast.error(err.message || "Failed to delete category");/g' src/pages/admin/Categories.tsx


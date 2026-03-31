package com.securespend.controller;

import com.securespend.entity.Expense;
import com.securespend.entity.User;
import com.securespend.repository.ExpenseRepository;
import com.securespend.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private UserRepository userRepository;

    // =========================
    // ADD EXPENSE
    // =========================
 // =========================
 // UPDATE EXPENSE
 // =========================
 @PutMapping("/{id}")
 public ResponseEntity<?> updateExpense(
         @PathVariable Long id,
         @RequestBody Expense updatedExpense) {

     String email = SecurityContextHolder
             .getContext()
             .getAuthentication()
             .getName();

     User user = userRepository.findByEmail(email).orElseThrow();

     Expense existingExpense = expenseRepository
             .findById(id)
             .orElseThrow();

     // 🔐 Check ownership
     if (!existingExpense.getUser().getId().equals(user.getId())) {
         return ResponseEntity.status(403)
                 .body("You cannot update this expense");
     }

     // ✏ Update fields
     existingExpense.setTitle(updatedExpense.getTitle());
     existingExpense.setAmount(updatedExpense.getAmount());
     existingExpense.setCategory(updatedExpense.getCategory());

     Expense saved = expenseRepository.save(existingExpense);

     return ResponseEntity.ok(saved);
 }
    // =========================
    // GET USER EXPENSES
    // =========================
    @GetMapping
    public ResponseEntity<?> getUserExpenses() {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        User user = userRepository.findByEmail(email).orElseThrow();

        List<Expense> expenses = expenseRepository.findByUser(user);

        return ResponseEntity.ok(expenses);
    }

    // =========================
    // DELETE EXPENSE
    // =========================
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteExpense(@PathVariable Long id) {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        User user = userRepository.findByEmail(email).orElseThrow();

        Expense expense = expenseRepository.findById(id)
                .orElseThrow();

        if (!expense.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403)
                    .body("You cannot delete this expense");
        }

        expenseRepository.delete(expense);

        return ResponseEntity.ok("Expense deleted successfully");
    }
}
package com.securespend.repository;

import com.securespend.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    @Query("""
        SELECT t FROM Transaction t
        WHERE t.user.id = :userId
        AND t.transactionDate >= :date
    """)
    List<Transaction> findLast30Days(Long userId, LocalDateTime date);

    long countByUserIdAndMerchantCategory(Long userId, String category);

    List<Transaction> findByUserId(Long userId);

    List<Transaction> findByFlaggedTrue();
}
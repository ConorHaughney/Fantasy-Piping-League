package com.example.FantasyPipingLeague.admin.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.example.FantasyPipingLeague.admin.model.Admin;
import com.example.FantasyPipingLeague.admin.model.AdminSession;

@Repository
public interface AdminSessionRepository extends JpaRepository<AdminSession, Long> {
    Optional<AdminSession> findBySessionTokenAndIsActiveTrue(String sessionToken);

    List<AdminSession> findByAdminAndIsActiveTrue(Admin admin);

    @Modifying
    @Transactional
    @Query("UPDATE AdminSession s SET s.isActive = false WHERE s.expiresAt < :now")
    void deactivateExpiredSessions(LocalDateTime now);

    @Modifying
    @Transactional
    @Query("DELETE FROM AdminSession s WHERE s.expiresAt < :expiry AND s.isActive = false")
    void deleteOldExpiredSessions(LocalDateTime expiry);
}
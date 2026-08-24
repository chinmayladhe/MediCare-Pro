package com.healthcare.mapper;

import com.healthcare.dto.*;
import com.healthcare.entity.*;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class EntityMapper {

    public PatientResponse toPatientResponse(Patient p) {
        if (p == null) return null;
        return new PatientResponse(
                p.getId(), p.getUsername(), p.getEmail(), p.getFirstName(), p.getLastName(),
                p.getRole().name(), p.getDateOfBirth(), p.getGender(), p.getBloodGroup(),
                p.getPhone(), p.getAddress(), p.getEmergencyContact(), p.getMedicalHistory(),
                p.getCreatedDate(), p.getUpdatedDate()
        );
    }

    public DoctorResponse toDoctorResponse(Doctor d) {
        if (d == null) return null;
        return new DoctorResponse(
                d.getId(), d.getUsername(), d.getEmail(), d.getFirstName(), d.getLastName(),
                d.getRole().name(), d.getPhone(), d.getSpecialization(), d.getQualification(),
                d.getExperience(), d.getConsultationFee(), d.getAvailableDays(), d.getAvailableTime(),
                d.getLicenseNumber(), d.getProfileImage(), d.getStatus(),
                d.getDepartment() != null ? d.getDepartment().getId() : null,
                d.getDepartment() != null ? d.getDepartment().getName() : null,
                d.getCreatedDate(), d.getUpdatedDate()
        );
    }

    public AppointmentResponse toAppointmentResponse(Appointment a) {
        if (a == null) return null;
        return new AppointmentResponse(
                a.getId(),
                a.getPatient().getId(),
                a.getPatient().getFirstName() + " " + a.getPatient().getLastName(),
                a.getDoctor().getId(),
                a.getDoctor().getFirstName() + " " + a.getDoctor().getLastName(),
                a.getDoctor().getSpecialization(),
                a.getAppointmentDate(),
                a.getAppointmentTime(),
                a.getReason(),
                a.getStatus().name(),
                a.getNotes(),
                a.getCreatedDate()
        );
    }

    public MedicalRecordResponse toMedicalRecordResponse(MedicalRecord m) {
        if (m == null) return null;
        return new MedicalRecordResponse(
                m.getId(),
                m.getPatient().getId(),
                m.getPatient().getFirstName() + " " + m.getPatient().getLastName(),
                m.getDoctor().getId(),
                m.getDoctor().getFirstName() + " " + m.getDoctor().getLastName(),
                m.getAppointment() != null ? m.getAppointment().getId() : null,
                m.getDiagnosis(), m.getSymptoms(), m.getTreatment(), m.getNotes(),
                m.getMedicalTestResults(), m.getRecordDate()
        );
    }

    public PrescriptionResponse toPrescriptionResponse(Prescription pr) {
        if (pr == null) return null;
        return new PrescriptionResponse(
                pr.getId(),
                pr.getPatient().getId(),
                pr.getPatient().getFirstName() + " " + pr.getPatient().getLastName(),
                pr.getDoctor().getId(),
                pr.getDoctor().getFirstName() + " " + pr.getDoctor().getLastName(),
                pr.getAppointment() != null ? pr.getAppointment().getId() : null,
                pr.getMedicines().stream().map(m -> new PrescriptionMedicineDto(
                        m.getMedicineName(), m.getDosage(), m.getFrequency(), m.getDuration(), m.getInstructions()
                )).collect(Collectors.toList()),
                pr.getPrescriptionDate()
        );
    }

    public BillResponse toBillResponse(Bill b) {
        if (b == null) return null;
        return new BillResponse(
                b.getId(),
                b.getPatient().getId(),
                b.getPatient().getFirstName() + " " + b.getPatient().getLastName(),
                b.getDoctor().getId(),
                b.getDoctor().getFirstName() + " " + b.getDoctor().getLastName(),
                b.getAppointment() != null ? b.getAppointment().getId() : null,
                b.getConsultationFee(), b.getMedicineCharges(), b.getTestCharges(),
                b.getOtherCharges(), b.getDiscount(), b.getTax(), b.getTotalAmount(),
                b.getPaymentStatus().name(), b.getBillDate()
        );
    }

    public PaymentResponse toPaymentResponse(Payment p) {
        if (p == null) return null;
        return new PaymentResponse(
                p.getId(), p.getBill().getId(), p.getPatient().getId(),
                p.getPatient().getFirstName() + " " + p.getPatient().getLastName(),
                p.getAmount(), p.getPaymentDate(), p.getPaymentMethod(),
                p.getTransactionId(), p.getPaymentStatus()
        );
    }
}

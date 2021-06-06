using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using ASPNetCoreApp.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace CarDealership.Models.Students
{
    public partial class StudentsContext : IdentityDbContext<User_>
    {
        public StudentsContext(DbContextOptions<StudentsContext> options) : base(options)
        {

        }

        public virtual DbSet<Subject> Subject { get; set; }
        public virtual DbSet<Group> Group { get; set; }
        public virtual DbSet<Student> Student { get; set; }
        public virtual DbSet<Event> Event { get; set; }
        public virtual DbSet<Event_Student> Event_Student { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Group>(entity =>
            {
                entity.HasOne(d => d.Subject)
                    .WithMany(p => p.Groups)
                    .HasForeignKey(d => d.SubjectFk);
            });

            modelBuilder.Entity<Student>(entity =>
            {
                entity.HasOne(d => d.Group)
                    .WithMany(p => p.Students)
                    .HasForeignKey(d => d.GroupFk);
            });

            modelBuilder.Entity<Event>(entity =>
            {
                entity.HasOne(d => d.Group)
                    .WithMany(p => p.Events)
                    .HasForeignKey(d => d.GroupFk);
            });

            modelBuilder.Entity<Event_Student>(entity =>
            {
                entity.HasOne(d => d.Event)
                    .WithMany(p => p.Event_Student)
                    .HasForeignKey(d => d.EventFk);
            });

            modelBuilder.Entity<Event_Student>(entity =>
            {
                entity.HasOne(d => d.Student)
                    .WithMany(p => p.Event_Student)
                    .HasForeignKey(d => d.StudentFk)
                    .OnDelete(DeleteBehavior.Restrict);
            });
        }
    }
}

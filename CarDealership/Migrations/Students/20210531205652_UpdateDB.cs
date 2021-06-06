using Microsoft.EntityFrameworkCore.Migrations;

namespace CarDealership.Migrations.Students
{
    public partial class UpdateDB : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Event_Student_Student_StudentFk",
                table: "Event_Student");

            migrationBuilder.AddForeignKey(
                name: "FK_Event_Student_Student_StudentFk",
                table: "Event_Student",
                column: "StudentFk",
                principalTable: "Student",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.DropColumn(
                name: "Mark",
                table: "Event_Student");

            migrationBuilder.AddColumn<int>(
                name: "Mark",
                table: "Event_Student",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Event_Student_Student_StudentFk",
                table: "Event_Student");

            migrationBuilder.AddForeignKey(
                name: "FK_Event_Student_Student_StudentFk",
                table: "Event_Student",
                column: "StudentFk",
                principalTable: "Student",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}

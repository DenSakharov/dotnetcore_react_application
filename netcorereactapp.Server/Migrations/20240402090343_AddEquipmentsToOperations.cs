using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace netcorereactapp.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddEquipmentsToOperations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "kd",
                table: "Procceses",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "m3",
                table: "Procceses",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "material",
                table: "Procceses",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "number",
                table: "Procceses",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "profile_size",
                table: "Procceses",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "laborCost",
                table: "Operations",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "number",
                table: "Operations",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "responsibleGroup",
                table: "Operations",
                type: "text",
                nullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "ProccesId",
                table: "Histories",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.CreateTable(
                name: "Equipments",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    OperationId = table.Column<int>(type: "integer", nullable: true),
                    Caption = table.Column<string>(type: "text", nullable: false),
                    DateOfCreture = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DateOfEdited = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Equipments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Equipments_Operations_OperationId",
                        column: x => x.OperationId,
                        principalTable: "Operations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Equipments_OperationId",
                table: "Equipments",
                column: "OperationId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Equipments");

            migrationBuilder.DropColumn(
                name: "kd",
                table: "Procceses");

            migrationBuilder.DropColumn(
                name: "m3",
                table: "Procceses");

            migrationBuilder.DropColumn(
                name: "material",
                table: "Procceses");

            migrationBuilder.DropColumn(
                name: "number",
                table: "Procceses");

            migrationBuilder.DropColumn(
                name: "profile_size",
                table: "Procceses");

            migrationBuilder.DropColumn(
                name: "laborCost",
                table: "Operations");

            migrationBuilder.DropColumn(
                name: "number",
                table: "Operations");

            migrationBuilder.DropColumn(
                name: "responsibleGroup",
                table: "Operations");

            migrationBuilder.AlterColumn<int>(
                name: "ProccesId",
                table: "Histories",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);
        }
    }
}

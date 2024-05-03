using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace netcorereactapp.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddingMaterialAndDetailInProcces : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "profile_size",
                table: "Procceses",
                newName: "VolumeIncludingSupportingStructures");

            migrationBuilder.RenameColumn(
                name: "material",
                table: "Procceses",
                newName: "ShieldingGasVolume");

            migrationBuilder.RenameColumn(
                name: "m3",
                table: "Procceses",
                newName: "PrintTime");

            migrationBuilder.RenameColumn(
                name: "kd",
                table: "Procceses",
                newName: "PartVolume");

            migrationBuilder.AddColumn<string>(
                name: "AdditionallyInformation",
                table: "Procceses",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "AmountOfRequiredMaterialTakingIntoAccount",
                table: "Procceses",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "BuildingHeight",
                table: "Procceses",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "EquipmentModel",
                table: "Procceses",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "EquipmentType",
                table: "Procceses",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LaborIntensity",
                table: "Procceses",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LayerThickness",
                table: "Procceses",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "OrganizationCaption",
                table: "Procceses",
                type: "text",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Details",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Quantity = table.Column<int>(type: "integer", nullable: true),
                    ProccesId = table.Column<int>(type: "integer", nullable: true),
                    Caption = table.Column<string>(type: "text", nullable: false),
                    DateOfCreture = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DateOfEdited = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Details", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Details_Procceses_ProccesId",
                        column: x => x.ProccesId,
                        principalTable: "Procceses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Materials",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    LoadWeightM3 = table.Column<int>(type: "integer", nullable: true),
                    ProfileAndSize = table.Column<int>(type: "integer", nullable: true),
                    OrganizationCaption = table.Column<string>(type: "text", nullable: true),
                    Quantity = table.Column<int>(type: "integer", nullable: true),
                    ProccesId = table.Column<int>(type: "integer", nullable: true),
                    Caption = table.Column<string>(type: "text", nullable: false),
                    DateOfCreture = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DateOfEdited = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Materials", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Materials_Procceses_ProccesId",
                        column: x => x.ProccesId,
                        principalTable: "Procceses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Details_ProccesId",
                table: "Details",
                column: "ProccesId");

            migrationBuilder.CreateIndex(
                name: "IX_Materials_ProccesId",
                table: "Materials",
                column: "ProccesId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Details");

            migrationBuilder.DropTable(
                name: "Materials");

            migrationBuilder.DropColumn(
                name: "AdditionallyInformation",
                table: "Procceses");

            migrationBuilder.DropColumn(
                name: "AmountOfRequiredMaterialTakingIntoAccount",
                table: "Procceses");

            migrationBuilder.DropColumn(
                name: "BuildingHeight",
                table: "Procceses");

            migrationBuilder.DropColumn(
                name: "EquipmentModel",
                table: "Procceses");

            migrationBuilder.DropColumn(
                name: "EquipmentType",
                table: "Procceses");

            migrationBuilder.DropColumn(
                name: "LaborIntensity",
                table: "Procceses");

            migrationBuilder.DropColumn(
                name: "LayerThickness",
                table: "Procceses");

            migrationBuilder.DropColumn(
                name: "OrganizationCaption",
                table: "Procceses");

            migrationBuilder.RenameColumn(
                name: "VolumeIncludingSupportingStructures",
                table: "Procceses",
                newName: "profile_size");

            migrationBuilder.RenameColumn(
                name: "ShieldingGasVolume",
                table: "Procceses",
                newName: "material");

            migrationBuilder.RenameColumn(
                name: "PrintTime",
                table: "Procceses",
                newName: "m3");

            migrationBuilder.RenameColumn(
                name: "PartVolume",
                table: "Procceses",
                newName: "kd");
        }
    }
}

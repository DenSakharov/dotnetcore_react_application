using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace netcorereactapp.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddNewRelationsProccesesAndOperations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Procceses",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Caption = table.Column<string>(type: "text", nullable: false),
                    DateOfCreture = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DateOfEdited = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Procceses", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Histories",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ProccesId = table.Column<int>(type: "integer", nullable: false),
                    Message = table.Column<string>(type: "text", nullable: false),
                    Caption = table.Column<string>(type: "text", nullable: false),
                    DateOfCreture = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DateOfEdited = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Histories", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Histories_Procceses_ProccesId",
                        column: x => x.ProccesId,
                        principalTable: "Procceses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Operations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ProccesId = table.Column<int>(type: "integer", nullable: true),
                    ParentOperationId = table.Column<int>(type: "integer", nullable: true),
                    Caption = table.Column<string>(type: "text", nullable: false),
                    DateOfCreture = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DateOfEdited = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Operations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Operations_Operations_ParentOperationId",
                        column: x => x.ParentOperationId,
                        principalTable: "Operations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Operations_Procceses_ProccesId",
                        column: x => x.ProccesId,
                        principalTable: "Procceses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Attachemnts",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    AttachmentData = table.Column<string>(type: "text", nullable: false),
                    OperationId = table.Column<int>(type: "integer", nullable: false),
                    Caption = table.Column<string>(type: "text", nullable: false),
                    DateOfCreture = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DateOfEdited = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Attachemnts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Attachemnts_Operations_OperationId",
                        column: x => x.OperationId,
                        principalTable: "Operations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Attachemnts_OperationId",
                table: "Attachemnts",
                column: "OperationId");

            migrationBuilder.CreateIndex(
                name: "IX_Histories_ProccesId",
                table: "Histories",
                column: "ProccesId");

            migrationBuilder.CreateIndex(
                name: "IX_Operations_ParentOperationId",
                table: "Operations",
                column: "ParentOperationId");

            migrationBuilder.CreateIndex(
                name: "IX_Operations_ProccesId",
                table: "Operations",
                column: "ProccesId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Attachemnts");

            migrationBuilder.DropTable(
                name: "Histories");

            migrationBuilder.DropTable(
                name: "Operations");

            migrationBuilder.DropTable(
                name: "Procceses");
        }
    }
}

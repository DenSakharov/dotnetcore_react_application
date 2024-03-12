using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace netcorereactapp.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddAttachmentsToProcces : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ProccedId",
                table: "Attachemnts",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Attachemnts_ProccedId",
                table: "Attachemnts",
                column: "ProccedId");

            migrationBuilder.AddForeignKey(
                name: "FK_Attachemnts_Procceses_ProccedId",
                table: "Attachemnts",
                column: "ProccedId",
                principalTable: "Procceses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Attachemnts_Procceses_ProccedId",
                table: "Attachemnts");

            migrationBuilder.DropIndex(
                name: "IX_Attachemnts_ProccedId",
                table: "Attachemnts");

            migrationBuilder.DropColumn(
                name: "ProccedId",
                table: "Attachemnts");
        }
    }
}

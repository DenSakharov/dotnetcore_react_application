using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace netcorereactapp.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddTextFiled_textOper_toOperation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "textOper",
                table: "Operations",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "textOper",
                table: "Operations");
        }
    }
}

export const formatDate = (dateString) => {
    //console.log("dateString -> " + dateString);
    if (!dateString) return ''; // ��������� �������, ����� ���� ����� null ��� undefined
    const date = new Date(dateString);
    const year = date.getFullYear();
    let month = (date.getMonth() + 1).toString().padStart(2, '0'); // ��������� ������� ����, ���� ����� �������� ���� �����
    let day = date.getDate().toString().padStart(2, '0'); // ��������� ������� ����, ���� ���� �������� ���� �����
    let hours = date.getHours().toString().padStart(2, '0'); // ��������� ������� ����, ���� ��� �������� ���� �����
    let minutes = date.getMinutes().toString().padStart(2, '0'); // ��������� ������� ����, ���� ������ �������� ���� �����
    let formattedDate = `${year}-${month}-${day}T${hours}:${minutes}`;
    //console.log(formattedDate);
    return formattedDate;
};
export const formatDate = (dateString) => {
    //console.log("dateString -> " + dateString);
    if (!dateString) return ''; // обработка случаев, когда дата равна null или undefined
    const date = new Date(dateString);
    const year = date.getFullYear();
    let month = (date.getMonth() + 1).toString().padStart(2, '0'); // добавл€ем ведущий ноль, если мес€ц содержит одну цифру
    let day = date.getDate().toString().padStart(2, '0'); // добавл€ем ведущий ноль, если день содержит одну цифру
    let hours = date.getHours().toString().padStart(2, '0'); // добавл€ем ведущий ноль, если час содержит одну цифру
    let minutes = date.getMinutes().toString().padStart(2, '0'); // добавл€ем ведущий ноль, если минута содержит одну цифру
    let formattedDate = `${year}-${month}-${day}T${hours}:${minutes}`;
    //console.log(formattedDate);
    return formattedDate;
};
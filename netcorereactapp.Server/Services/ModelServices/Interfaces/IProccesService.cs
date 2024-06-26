﻿using ClassesLibrary.DataTransferObjects;
using ClassesLibrary.Models;

namespace netcorereactapp.Server.Services.ModelServices.Interfaces
{
    public interface IProccesService
    {
        public Task<ProccesDTO> GetCurrent(int id);

        public Task<(List<Procces>, int)> GetAll(int page, int pageSize);
        public Task<Procces> Create(ProccesDTO procces);
        public Task<Procces> Create(Procces procces);
        public Task<Procces> UpdateProcces(ProccesDTO editedProcces);
        public Task<Procces> UpdateProcces(Procces editedProcces);
        public Task<Procces> AddingAttachmentsToSelectedProcces(int proccesId, IFormFileCollection files);
        public Task<Procces> AddingAttachmentsWithCategoriesToSelectedProcces(int proccesId, IFormCollection fotm);
        public Task<bool> DeleteProcces(int id);
    }
}

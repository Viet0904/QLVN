// QLVN-Application/Services/DvsdService.cs
using AutoMapper;
using QLVN_Domain.Entities;
using QLVN_Domain.Interfaces;
using QLVN_Contracts.Dtos.Dvsd;
using QLVN_Application.Interfaces;

namespace QLVN_Application.Services
{
    public class DvsdService : IDvsdService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public DvsdService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<IEnumerable<DvsdDto>> GetAllAsync()
        {
            var list = await _unitOfWork.Repository<DbDvsd>().GetAllAsync();
            return _mapper.Map<IEnumerable<DvsdDto>>(list);
        }

        public async Task CreateAsync(CreateDvsdRequest request)
        {
            var entity = _mapper.Map<DbDvsd>(request);
            // Set các giá trị mặc định (như CreatedAt, CreatedBy...)
            entity.CreatedAt = DateTime.Now;

            await _unitOfWork.Repository<DbDvsd>().AddAsync(entity);
            await _unitOfWork.SaveChangesAsync();
        }
    }
}
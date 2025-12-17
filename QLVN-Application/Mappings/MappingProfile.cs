using AutoMapper;
using QLVN_Domain.Entities;
using QLVN_Contracts.Dtos.Dvsd;

namespace QLVN_Application.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // Map 2 chiều giữa Entity và DTO
            CreateMap<DbDvsd, DvsdDto>().ReverseMap();
            CreateMap<CreateDvsdRequest, DbDvsd>();
        }
    }
}
using AutoMapper;
using QLVN_Contracts.Dtos.Dvsd;
using QLVN_Contracts.Dtos.User;
using QLVN_Domain.Entities;

namespace QLVN_Application.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // Map 2 chiều giữa Entity và DTO
            CreateMap<DbDvsd, DvsdDto>().ReverseMap();
            CreateMap<CreateDvsdRequest, DbDvsd>();

            CreateMap<UsUser, UserDto>().ReverseMap();
            CreateMap<CreateUserRequest, UsUser>();
        }
    }
}
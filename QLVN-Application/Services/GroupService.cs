using AutoMapper;
using QLVN_Application.Interfaces;
using QLVN_Contracts.Dtos.Group;
using QLVN_Domain.Entities;
using QLVN_Domain.Interfaces;

namespace QLVN_Application.Services;

public class GroupService : IGroupService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public GroupService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<IEnumerable<GroupDto>> GetAllAsync()
    {
        var groups = await _unitOfWork.Repository<UsGroup>().GetAllAsync();
        var activeGroups = groups.Where(g => g.RowStatus == 1);
        return _mapper.Map<IEnumerable<GroupDto>>(activeGroups);
    }
}
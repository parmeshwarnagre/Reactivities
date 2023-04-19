using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Persistence;

namespace Application.Activities
{
    public class List
    {
       public class Query :IRequest<List<Activity>>{}

        public class Handler : IRequestHandler<Query, List<Activity>>
        {
            private readonly DataContext _context;
        

           public  Handler(DataContext context)
            {
                _context = context;
            }
            // public async Task<List<Activity>> Handle(Query request, CancellationToken cancellationToken)//Cancellatioon token required to cancel the request whhich will take more time to execute or no longer needed to execute then this token is required
            // {
            //     try
            //     {
            //         for(var i=0;i<10;i++)
            //         {
            //             cancellationToken.ThrowIfCancellationRequested();
            //             await Task.Delay(1000,cancellationToken);
            //             _logger.LogInformation($"Task {i} has completed");
            //         }
            //     }
            //     catch (System.Exception)
            //     {
                    
            //         _logger.LogInformation("Task was cancelled");
            //     }
            //     return  await _context.Activities.ToListAsync();
            // }
            public async Task<List<Activity>> Handle(Query request,CancellationToken cancellationToken)//Cancellatioon token required to cancel the request whhich will take more time to execute or no longer needed to execute then this token is required
            {
               return  await _context.Activities.ToListAsync();
            }
        }
    }
}
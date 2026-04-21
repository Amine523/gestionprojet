using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;

namespace Gestprojet.Metier.ApiParamSociete.WebApi.Controllers
{
    [ApiController]
    [Route("api/chatrooms")]
    public class ChatRoomController : ControllerBase
    {
        private static readonly List<object> _chatRooms = new List<object>();

        [HttpGet]
        public IActionResult GetChatRooms()
        {
            return Ok(_chatRooms);
        }

        [HttpPost]
        public IActionResult CreateChatRoom([FromBody] dynamic chatRoom)
        {
            _chatRooms.Add(chatRoom);
            return Ok(new { success = true, message = "Chat room créée avec succès", data = chatRoom });
        }
    }
}

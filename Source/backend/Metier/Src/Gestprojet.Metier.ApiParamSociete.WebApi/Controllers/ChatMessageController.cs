using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace Gestprojet.Metier.ApiParamSociete.WebApi.Controllers
{
    [ApiController]
    [Route("api/chatmessages")]
    public class ChatMessageController : ControllerBase
    {
        private static readonly string _filePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "chat_messages.json");
        private static List<dynamic> _chatMessages = LoadMessages();

        private static List<dynamic> LoadMessages()
        {
            if (!System.IO.File.Exists(_filePath)) return new List<dynamic>();
            try { 
                var json = System.IO.File.ReadAllText(_filePath);
                return Newtonsoft.Json.JsonConvert.DeserializeObject<List<dynamic>>(json) ?? new List<dynamic>();
            } catch { return new List<dynamic>(); }
        }

        private static void SaveMessages()
        {
            try {
                var json = Newtonsoft.Json.JsonConvert.SerializeObject(_chatMessages);
                System.IO.File.WriteAllText(_filePath, json);
            } catch { }
        }

        [HttpGet]
        public IActionResult GetChatMessages([FromQuery] string chatRoomId)
        {
            var messages = _chatMessages.Where(m => m?.chatRoomId?.ToString() == chatRoomId).ToList();
            return Ok(messages);
        }

        [HttpPost]
        public IActionResult SendChatMessage([FromBody] dynamic chatMessage)
        {
            _chatMessages.Add(chatMessage);
            SaveMessages();
            return Ok(new { success = true, message = "Message envoyé", data = chatMessage });
        }
    }
}

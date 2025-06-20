import pytz
import threading
import subprocess

from typing import Any, List, Dict, Tuple, Optional

from app import schemas
from app.core.config import settings
from datetime import datetime, timedelta
from app.core.event import eventmanager, Event
from app.log import logger
from app.plugins import _PluginBase
from app.schemas import Response
from app.schemas.types import EventType
from apscheduler.schedulers.background import BackgroundScheduler


class MergeVideo(_PluginBase):
    # 插件名称
    plugin_name = "短剧合并助手"
    # 插件描述
    plugin_desc = "将短剧按集进行合并，将多个小视频合并为一个视频"
    # 插件图标
    plugin_icon = "https://raw.githubusercontent.com/Mattoids/MoviePilot-Plugins/refs/heads/main/icons/mergevideo.png"
    # 插件版本
    plugin_version = "0.1"
    # 插件作者
    plugin_author = "Mattoid"
    # 作者主页
    author_url = "https://github.com/Mattoids"
    # 插件配置项ID前缀
    plugin_config_prefix = "merge_video_"
    # 加载顺序
    plugin_order = 10
    # 可使用的用户级别
    auth_level = 1

    # 私有属性
    _scheduler: Optional[BackgroundScheduler] = None
    _running: bool = False
    _onlyonce: bool = False
    _lock: Optional[threading.Lock] = None
    _max_history_entries: int = 1000

    # 配置属性
    _enabled: bool = True
    _cron: str = "0 * * * *"

    _clear_history: bool = False  # 新增：清理历史记录开关


    def init_plugin(self, config: Optional[dict] = None):
        self._lock = threading.Lock()
        self.stop_service()
        if config:
            self._enabled = bool(config.get("enabled", False))
            self._cron = str(config.get("cron", "0 * * * *"))
            self._onlyonce = bool(config.get("onlyonce", False))

            self._clear_history = bool(config.get("clear_history", False))  # 新增：清理历史记录开关
            self.__update_config()

        if self._enabled or self._onlyonce:
            if self._onlyonce:
                try:
                    if not self._scheduler or not self._scheduler.running:
                        self._scheduler = BackgroundScheduler(timezone=settings.TZ)

                        job_name = f"{self.plugin_name}服务_onlyonce"
                        if self._scheduler.get_job(job_name):
                            self._scheduler.remove_job(job_name)

                        logger.info(f"{self.plugin_name} 服务启动，立即运行一次")
                        self._scheduler.add_job(func=self._merge_video, trigger='date',
                                                run_date=datetime.now(tz=pytz.timezone(settings.TZ)) + timedelta(
                                                    seconds=3),
                                                name=job_name, id=job_name)
                        self._onlyonce = False
                        self.__update_config()

                        if self._scheduler and not self._scheduler.running:
                            self._scheduler.print_jobs()
                            self._scheduler.start()

                except Exception as e:
                    logger.error(f"启动一次性 {self.plugin_name} 任务失败: {str(e)}")

    def get_render_mode(self) -> Tuple[str, str]:
        """
        获取插件渲染模式
        :return: 1、渲染模式，支持：vue/vuetify，默认vuetify
        :return: 2、组件路径，默认 dist/assets
        """
        return "vue", "dist/assets"

    def get_form(self) -> Tuple[List[dict], Dict[str, Any]]:
        """
        拼装插件配置页面，需要返回两块数据：1、页面配置；2、数据结构
        """
        return [], {}

    def get_page(self) -> List[dict]:
        return []

    def _load_history(self) -> list[dict[str, str]]:
        return [{
            'title': '你好，李焕英！',
            'type': 'success',
            'time': '2025-06-20 10:00:00'
        }]

    def __update_config(self):
        self.update_config({
            "enabled": self._enabled,
            "cron": self._cron,
            "clear_history": self._clear_history,  # 新增：清理历史记录开关
        })

    def get_state(self) -> bool:
        return self._enabled

    def get_api(self) -> List[Dict[str, Any]]:
        return [
            {
                "path": "/history",
                "endpoint": self._load_history,
                "methods": ["GET"],
                "summary": "获取历史记录",
                "description": "获取合并历史，可重新整理或删除记录",
                "auth": "bear",
            },
        ]

    def get_command(self) -> List[Dict[str, Any]]:
        return [{
            "cmd": "/merge_video_sync",
            "event": EventType.PluginAction,
            "desc": "合并短剧",
            "category": "合并短剧",
            "data": {
                "action": "merge_video_sync"
            }
        }]

    @eventmanager.register(EventType.PluginAction)
    def command_action(self, event: Event):
        pass

    def _send_main_menu(self, channel, source, userid, original_message_id=None, original_chat_id=None):
        """
        发送主菜单
        """
        buttons = [
            [
                {"text": "🎬 媒体管理", "callback_data": f"[PLUGIN]{self.__class__.__name__}|menu1"},
                {"text": "⚙️ 系统设置", "callback_data": f"[PLUGIN]{self.__class__.__name__}|menu2"}
            ],
            [
                {"text": "📊 查看状态", "callback_data": f"[PLUGIN]{self.__class__.__name__}|status"}
            ]
        ]

        self.post_message(
            channel=channel,
            title="🤖 插件交互演示",
            text="请选择要执行的操作：",
            userid=userid,
            buttons=buttons,
            original_message_id=original_message_id,
            original_chat_id=original_chat_id
        )

    def _handle_menu1(self, channel, source, userid, original_message_id, original_chat_id):
        """
        处理媒体管理菜单
        """
        buttons = [
            [
                {"text": "🔍 搜索媒体", "callback_data": f"[PLUGIN]{self.__class__.__name__}|action_search"},
                {"text": "📥 下载管理", "callback_data": f"[PLUGIN]{self.__class__.__name__}|action_download"}
            ],
            [
                {"text": "🔙 返回主菜单", "callback_data": f"[PLUGIN]{self.__class__.__name__}|back"}
            ]
        ]

        self.post_message(
            channel=channel,
            title="🎬 媒体管理",
            text="选择媒体管理功能：",
            userid=userid,
            buttons=buttons,
            original_message_id=original_message_id,
            original_chat_id=original_chat_id
        )

    @eventmanager.register(EventType.MessageAction)
    def message_action(self, event: Event):
        """
        处理消息按钮回调
        """
        event_data = event.event_data
        if not event_data:
            return

        # 检查是否为本插件的回调
        plugin_id = event_data.get("plugin_id")
        if plugin_id != self.__class__.__name__:
            return

        # 获取回调数据
        text = event_data.get("text", "")
        channel = event_data.get("channel")
        source = event_data.get("source")
        userid = event_data.get("userid")
        # 获取原始消息ID和聊天ID（用于直接更新原消息）
        original_message_id = event_data.get("original_message_id")
        original_chat_id = event_data.get("original_chat_id")

        # 根据回调内容处理不同的交互
        if text == "menu1":
            self._handle_menu1(channel, source, userid, original_message_id, original_chat_id)
        elif text == "back":
            self._send_main_menu(channel, source, userid, original_message_id, original_chat_id)
        elif text.startswith("action_"):
            action_id = text.replace("action_", "")
            self._handle_action(action_id, channel, source, userid, original_message_id, original_chat_id)

    def _handle_action(self, action_id, channel, source, userid, original_message_id, original_chat_id):
        """
        处理具体动作
        """
        if action_id == "search":
            # 执行搜索逻辑
            result = "搜索功能已执行"
        elif action_id == "download":
            # 执行下载逻辑
            result = "下载管理已开启"
        else:
            result = "未知操作"

        # 发送执行结果并提供返回按钮
        buttons = [
            [{"text": "🔙 返回主菜单", "callback_data": f"[PLUGIN]{self.__class__.__name__}|back"}]
        ]

        self.post_message(
            channel=channel,
            title="✅ 操作完成",
            text=result,
            userid=userid,
            buttons=buttons,
            original_message_id=original_message_id,
            original_chat_id=original_chat_id
        )

    def _merge_video(self, strm_path: str, image_path: str, frames: str = None):
        """
        使用ffmpeg从视频文件中截取缩略图
        """
        if not frames:
            frames = "00:03:01"
        if not strm_path or not image_path:
            return False
        cmd = 'ffmpeg -ss {frames} -i "{strm_path}" -vframes 1 -f image2 "{image_path}"'.format(strm_path=strm_path,
                                                                                                frames=frames,
                                                                                                image_path=image_path)
        result = self.execute(cmd)
        if result:
            return True
        return False

    def execute(self, cmd: str) -> str:
        """
        执行命令，获得返回结果
        """
        try:
            result = subprocess.run(cmd, check=True, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE,
                                    text=True)
            output = result.stdout.strip() if result.stdout else result.stderr.strip()
            return output
        except subprocess.CalledProcessError as err:
            logger.error(f"ffmpeg执行命令 '{cmd}' 失败-error: {err.stderr}")
            return ""

    def stop_service(self):
        try:
            if self._scheduler:
                job_name = f"{self.plugin_name}服务_onlyonce"
                if self._scheduler.get_job(job_name):
                    self._scheduler.remove_job(job_name)
                if self._lock and hasattr(self._lock, 'locked') and self._lock.locked():
                    logger.info(f"等待 {self.plugin_name} 当前任务执行完成...")
                    acquired = self._lock.acquire(timeout=300)
                    if acquired: self._lock.release()
                    else: logger.warning(f"{self.plugin_name} 等待任务超时。")
                if hasattr(self._scheduler, 'remove_all_jobs') and not self._scheduler.get_jobs(jobstore='default'):
                     pass
                elif hasattr(self._scheduler, 'remove_all_jobs'):
                    self._scheduler.remove_all_jobs()
                if hasattr(self._scheduler, 'running') and self._scheduler.running:
                    if not self._scheduler.get_jobs():
                         self._scheduler.shutdown(wait=False)
                         self._scheduler = None
                logger.info(f"{self.plugin_name} 服务已停止或已无任务。")
        except Exception as e:
            logger.error(f"{self.plugin_name} 退出插件失败：{str(e)}")
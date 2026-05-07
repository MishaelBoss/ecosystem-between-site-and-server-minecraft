import requests
from django.http import JsonResponse
from mcstatus import JavaServer

MC_SERVER_HOST = "c5.play2go.cloud"
SMP_SHIELD_PORT = 8080

def get_tps_from_plugin():
    try:
        url = f"http://{MC_SERVER_HOST}:{SMP_SHIELD_PORT}/status"
        response = requests.get(url, timeout=3)
        response.raise_for_status()
        data = response.json()
        tps = data.get("tps")
        if tps is not None:
            return round(float(tps), 1)
    except Exception as e:
        print(f"Ошибка получения TPS из SMPShield: {e}")
    return None

def server_status(request):
    server = JavaServer.lookup("c5.play2go.cloud:20641")
    try:
        status = server.status()
        latency = server.ping()
        players_list = []
        try:
            query = server.query()
            players_list = query.players.names
        except:
            pass

        tps = get_tps_from_plugin() or 20.0
        
        from datetime import datetime
        start_date = datetime(2023, 1, 1)
        days_online = (datetime.now() - start_date).days

        return JsonResponse({
            'online': True,
            'players': status.players.online,
            'maxPlayers': status.players.max,
            'motd': status.description,
            'version': status.version.name,
            'playersList': players_list,
            'latency': round(latency, 0),
            'tps': tps,
            'ip': 'c5.play2go.cloud',
            'port': 20167,
            'mode': 'Выживание',
            'days_online': days_online,
            'uptime': '99.9%',
        })
    except Exception as e:
        return JsonResponse({'online': False, 'error': str(e), 'latency': 0, 'tps': 20.0})
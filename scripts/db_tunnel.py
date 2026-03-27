import argparse
import select
import socket
import socketserver
import sys
import threading
import time
from pathlib import Path

import paramiko


class ForwardHandler(socketserver.BaseRequestHandler):
    ssh_transport = None
    remote_host = None
    remote_port = None

    def handle(self):
        try:
            channel = self.ssh_transport.open_channel(
                "direct-tcpip",
                (self.remote_host, self.remote_port),
                self.request.getpeername(),
            )
        except Exception:
            return

        if channel is None:
            return

        sockets = [self.request, channel]
        try:
            while True:
                readable, _, _ = select.select(sockets, [], [], 1)
                if self.request in readable:
                    data = self.request.recv(4096)
                    if not data:
                        break
                    channel.sendall(data)
                if channel in readable:
                    data = channel.recv(4096)
                    if not data:
                        break
                    self.request.sendall(data)
        finally:
            channel.close()
            self.request.close()


class ThreadedTCPServer(socketserver.ThreadingTCPServer):
    allow_reuse_address = True
    daemon_threads = True


def port_open(host: str, port: int) -> bool:
    try:
        with socket.create_connection((host, port), timeout=1):
            return True
    except OSError:
        return False


def wait_forever(client: paramiko.SSHClient, server: ThreadedTCPServer, ready_file: Path | None):
    if ready_file:
        ready_file.write_text(str(server.server_address[1]), encoding='utf-8')
    try:
        while True:
            transport = client.get_transport()
            if transport is None or not transport.is_active():
                raise RuntimeError('SSH transport is no longer active')
            time.sleep(1)
    finally:
        if ready_file and ready_file.exists():
            ready_file.unlink(missing_ok=True)
        server.shutdown()
        server.server_close()
        client.close()


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--ssh-host', required=True)
    parser.add_argument('--ssh-user', required=True)
    parser.add_argument('--ssh-password', required=True)
    parser.add_argument('--local-host', default='127.0.0.1')
    parser.add_argument('--local-port', type=int, required=True)
    parser.add_argument('--remote-host', default='127.0.0.1')
    parser.add_argument('--remote-port', type=int, required=True)
    parser.add_argument('--ready-file', default='')
    args = parser.parse_args()

    if port_open(args.local_host, args.local_port):
        if args.ready_file:
            Path(args.ready_file).write_text(str(args.local_port), encoding='utf-8')
        return 0

    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(
        hostname=args.ssh_host,
        username=args.ssh_user,
        password=args.ssh_password,
        timeout=20,
        banner_timeout=20,
        auth_timeout=20,
    )

    handler = type(
        'BoundForwardHandler',
        (ForwardHandler,),
        {
            'ssh_transport': client.get_transport(),
            'remote_host': args.remote_host,
            'remote_port': args.remote_port,
        },
    )
    server = ThreadedTCPServer((args.local_host, args.local_port), handler)
    threading.Thread(target=server.serve_forever, daemon=True).start()
    wait_forever(client, server, Path(args.ready_file) if args.ready_file else None)
    return 0


if __name__ == '__main__':
    try:
        raise SystemExit(main())
    except KeyboardInterrupt:
        raise SystemExit(0)

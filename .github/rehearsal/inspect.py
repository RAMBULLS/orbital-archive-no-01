"""Hosted only: verify and safely unpack two pinned public Pages packages."""
import hashlib
import json
import os
import pathlib
import tarfile

root = pathlib.Path(os.environ["RUNNER_TEMP"]) / "rehearsal"
proof = root / "proof"
proof.mkdir()
pins = {
    "candidate": "1721693bbb33a4aecae232ab3ed9238cc49cca4e",
    "rollback": "40d8141c6c20dd3c98a4ab76b32af54a55158d1b",
}
reports = {}
for label, sha in pins.items():
    manifest = json.loads((root / "previous-proof" / (label + "-manifest.json")).read_text())
    assert manifest["source_sha"] == sha
    expected = {row["path"]: row["sha256"] for row in manifest["files"]}
    assert len(expected) == 242 and ".nojekyll" in expected
    site = root / (label + "-site")
    site.mkdir()
    observed = {}
    with tarfile.open(root / label / "artifact.tar") as archive:
        members = archive.getmembers()
        assert len(members) < 1000 and sum(m.size for m in members) < 8 * 1024 * 1024
        for member in members:
            path = pathlib.PurePosixPath(member.name)
            assert not path.is_absolute() and ".." not in path.parts
            assert member.isdir() or member.isfile()
            assert not any(p.lower() in ["agents.md", "claude.md", "gemini.md", ".github", ".git", ".env"] for p in path.parts)
            if not member.isfile():
                continue
            name = path.as_posix()
            assert name in expected and name not in observed
            data = archive.extractfile(member).read()
            digest = hashlib.sha256(data).hexdigest()
            assert digest == expected[name]
            observed[name] = digest
            destination = site / name
            destination.parent.mkdir(parents=True, exist_ok=True)
            destination.write_bytes(data)
    assert observed == expected
    reports[label] = {"source_sha": sha, "file_count": len(observed), "all_file_hashes_match": True}
(proof / "archive-checks.json").write_text(json.dumps(reports, indent=2))
print(json.dumps(reports))

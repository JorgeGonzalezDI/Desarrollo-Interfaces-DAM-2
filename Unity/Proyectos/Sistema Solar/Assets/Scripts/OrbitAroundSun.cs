using UnityEngine;

public class OrbitAroundSun : MonoBehaviour
{
    [SerializeField] private Transform sun;
    [SerializeField] private float orbitSpeed = 20f;
    [SerializeField] private float rotationSpeed = 50f;

    void Update()
    {
        if (sun == null) return;
        transform.RotateAround(sun.position, Vector3.up, orbitSpeed * Time.deltaTime);
        transform.Rotate(Vector3.up, rotationSpeed * Time.deltaTime, Space.Self);
    }
}